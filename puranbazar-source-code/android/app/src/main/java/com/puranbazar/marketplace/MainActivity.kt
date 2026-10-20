package com.puranbazar.marketplace

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    companion object {
        const val BASE_URL = "https://puranbazar.com"
        const val APP_HOST = "puranbazar.com"
        const val PREF_NAME = "puranbazar_prefs"
        const val PREF_LANG = "puranbazar_language"
    }

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var layoutOffline: LinearLayout
    private lateinit var btnRetry: Button
    private lateinit var prefs: SharedPreferences

    private var currentLanguage: String = "bn"
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var cameraImageUri: Uri? = null

    // Photo/File Picker Launcher for Ad Photo Uploading
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (filePathCallback == null) return@registerForActivityResult

        var results: Array<Uri>? = null
        if (result.resultCode == RESULT_OK) {
            val intentData = result.data
            if (intentData == null || intentData.data == null) {
                cameraImageUri?.let { uri ->
                    results = arrayOf(uri)
                }
            } else {
                val dataUri = intentData.data
                if (dataUri != null) {
                    results = arrayOf(dataUri)
                }
            }
        }
        filePathCallback?.onReceiveValue(results)
        filePathCallback = null
    }

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { _ -> }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        prefs = getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        currentLanguage = prefs.getString(PREF_LANG, "bn") ?: "bn"
        applyAppLocale(currentLanguage)

        setContentView(R.layout.activity_main)

        // Initialize UI components
        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefresh)
        progressBar = findViewById(R.id.progressBar)
        layoutOffline = findViewById(R.id.layoutOffline)
        btnRetry = findViewById(R.id.btnRetry)

        swipeRefresh.setColorSchemeResources(R.color.primary, R.color.accent)
        swipeRefresh.setOnRefreshListener {
            if (isNetworkAvailable()) {
                webView.reload()
            } else {
                swipeRefresh.isRefreshing = false
                showOfflineScreen(true)
            }
        }

        btnRetry.setOnClickListener {
            if (isNetworkAvailable()) {
                showOfflineScreen(false)
                webView.reload()
            } else {
                Toast.makeText(this, getString(R.string.offline_title), Toast.LENGTH_SHORT).show()
            }
        }

        setupWebView()
        setupBackNavigation()
        requestAppPermissions()

        val targetUrl = intent?.data?.toString() ?: BASE_URL
        if (isNetworkAvailable()) {
            webView.loadUrl(targetUrl)
        } else {
            showOfflineScreen(true)
        }
    }

    /**
     * Bilingual locale manager for Android Native Layer (BN / EN)
     */
    private fun applyAppLocale(langCode: String) {
        val locale = Locale(langCode)
        Locale.setDefault(locale)
        val config = Configuration()
        config.setLocale(locale)
        resources.updateConfiguration(config, resources.displayMetrics)
    }

    fun switchLanguage(langCode: String) {
        currentLanguage = langCode
        prefs.edit().putString(PREF_LANG, langCode).apply()
        applyAppLocale(langCode)

        // Sync with WebView localStorage and trigger react update
        webView.evaluateJavascript(
            "window.localStorage.setItem('puranbazar_language', '$langCode'); window.dispatchEvent(new Event('storage'));",
            null
        )

        val msg = if (langCode == "en") "Language switched to English" else "ভাষা বাংলায় পরিবর্তিত হয়েছে"
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.cacheMode = if (isNetworkAvailable()) WebSettings.LOAD_DEFAULT else WebSettings.LOAD_CACHE_ELSE_NETWORK

        val defaultUserAgent = settings.userAgentString
        settings.userAgentString = "$defaultUserAgent PuranBazarAndroidApp/1.0 Lang/$currentLanguage"

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        // JavaScript Bridge for bi-directional language synchronization
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidApp")

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                    swipeRefresh.isRefreshing = false
                }
            }

            override fun onShowFileChooser(
                mWebView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                openFileChooser()
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                showOfflineScreen(false)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false

                // Inject current language preference so website loads in matching BN/EN language
                webView.evaluateJavascript(
                    "if(window.localStorage.getItem('puranbazar_language') !== '$currentLanguage') { window.localStorage.setItem('puranbazar_language', '$currentLanguage'); window.dispatchEvent(new Event('storage')); }",
                    null
                )
            }

            override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                if (!isNetworkAvailable()) {
                    showOfflineScreen(true)
                }
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url ?: return false
                val urlString = url.toString()

                if (urlString.startsWith("tel:")) {
                    startActivity(Intent(Intent.ACTION_DIAL, url))
                    return true
                }

                if (urlString.startsWith("mailto:")) {
                    startActivity(Intent(Intent.ACTION_SENDTO, url))
                    return true
                }

                if (urlString.startsWith("whatsapp:") || urlString.contains("wa.me") || urlString.contains("api.whatsapp.com")) {
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, url))
                    } catch (e: ActivityNotFoundException) {
                        Toast.makeText(this@MainActivity, "WhatsApp not installed", Toast.LENGTH_SHORT).show()
                    }
                    return true
                }

                if (url.host == APP_HOST || urlString.contains("ais-") || urlString.contains("puranbazar")) {
                    return false
                }

                try {
                    startActivity(Intent(Intent.ACTION_VIEW, url))
                    return true
                } catch (e: Exception) {
                    return false
                }
            }
        }

        webView.setDownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            try {
                val request = DownloadManager.Request(Uri.parse(url)).apply {
                    setMimeType(mimeType)
                    addRequestHeader("User-Agent", userAgent)
                    setDescription("PuranBazar file downloading...")
                    setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType))
                    setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    setDestinationInExternalPublicDir(
                        Environment.DIRECTORY_DOWNLOADS,
                        URLUtil.guessFileName(url, contentDisposition, mimeType)
                    )
                }
                val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                dm.enqueue(request)
                Toast.makeText(this, "Downloading...", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(this, "Download failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun openFileChooser() {
        var takePictureIntent: Intent? = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        if (takePictureIntent?.resolveActivity(packageManager) != null) {
            var photoFile: File? = null
            try {
                photoFile = createImageFile()
            } catch (ex: IOException) {}
            if (photoFile != null) {
                cameraImageUri = FileProvider.getUriForFile(
                    this,
                    "${applicationContext.packageName}.fileprovider",
                    photoFile
                )
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri)
            } else {
                takePictureIntent = null
            }
        }

        val contentSelectionIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "image/*"
            putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
        }

        val intentArray: Array<Intent?> = takePictureIntent?.let { arrayOf(it) } ?: arrayOfNulls(0)
        val chooserIntent = Intent(Intent.ACTION_CHOOSER).apply {
            putExtra(Intent.EXTRA_INTENT, contentSelectionIntent)
            putExtra(Intent.EXTRA_TITLE, if (currentLanguage == "en") "Select Photo" else "ছবি নির্বাচন বা ক্যাপচার করুন")
            putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray)
        }

        fileChooserLauncher.launch(chooserIntent)
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir: File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile("JPEG_${timeStamp}_", ".jpg", storageDir)
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    showExitDialog()
                }
            }
        })
    }

    private fun showExitDialog() {
        AlertDialog.Builder(this)
            .setTitle(getString(R.string.exit_confirm_title))
            .setMessage(getString(R.string.exit_confirm_msg))
            .setPositiveButton(getString(R.string.btn_yes)) { _, _ -> finish() }
            .setNegativeButton(getString(R.string.btn_no), null)
            .show()
    }

    private fun showOfflineScreen(show: Boolean) {
        layoutOffline.visibility = if (show) View.VISIBLE else View.GONE
        swipeRefresh.visibility = if (show) View.GONE else View.VISIBLE
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val activeNetwork = connectivityManager.getNetworkCapabilities(network) ?: return false
        return when {
            activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
            activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
            activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
            else -> false
        }
    }

    private fun requestAppPermissions() {
        val permissionsToRequest = mutableListOf<String>()
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.CAMERA)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.READ_MEDIA_IMAGES)
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.READ_EXTERNAL_STORAGE)
            }
        }
        if (permissionsToRequest.isNotEmpty()) {
            permissionLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }

    /**
     * JS interface for sync from website
     */
    class WebAppInterface(private val activity: MainActivity) {
        @JavascriptInterface
        fun onLanguageChanged(lang: String) {
            activity.runOnUiThread {
                activity.switchLanguage(lang)
            }
        }
    }
}
