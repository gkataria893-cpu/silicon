import React from 'react';
import { Terminal, Copy, Check, FileCode, Play, Smartphone, HelpCircle, HardDrive, Cpu, ShieldCheck } from 'lucide-react';

export default function AndroidProjectSection() {
  const [activeFile, setActiveFile] = React.useState<'main_activity' | 'manifest' | 'layout' | 'gradle'>('main_activity');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileContents = {
    main_activity: {
      name: 'MainActivity.kt',
      path: '/android/app/src/main/java/com/siliconproduct/app/MainActivity.kt',
      lang: 'kotlin',
      code: `package com.siliconproduct.app

import android.annotation.SuppressLint
import android.app.Activity
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.ProgressBar
import android.widget.RelativeLayout
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var offlineLayout: RelativeLayout
    private lateinit var retryButton: Button

    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var cameraPhotoPath: String? = null

    private var doubleBackToExitPressedOnce = false
    private val webUrl = "https://yourwebsite.com" // Replace with your live web app URL

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefresh)
        progressBar = findViewById(R.id.progressBar)
        offlineLayout = findViewById(R.id.offlineLayout)
        retryButton = findViewById(R.id.btnRetry)

        swipeRefreshLayout.setColorSchemeColors(
            resources.getColor(R.color.primaryColor, theme),
            resources.getColor(R.color.accentColor, theme)
        )
        swipeRefreshLayout.setOnRefreshListener {
            if (isNetworkAvailable()) {
                webView.reload()
            } else {
                swipeRefreshLayout.isRefreshing = false
                showOfflineScreen()
            }
        }

        retryButton.setOnClickListener {
            if (isNetworkAvailable()) {
                offlineLayout.visibility = View.GONE
                webView.visibility = View.VISIBLE
                webView.reload()
            } else {
                Toast.makeText(this, "Still offline. Please check connection.", Toast.LENGTH_SHORT).show()
            }
        }

        setupWebView()

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    if (doubleBackToExitPressedOnce) {
                        finish()
                    } else {
                        doubleBackToExitPressedOnce = true
                        Toast.makeText(this@MainActivity, "Press back again to exit", Toast.LENGTH_SHORT).show()
                        Handler(Looper.getMainLooper()).postDelayed({
                            doubleBackToExitPressedOnce = false
                        }, 2000)
                    }
                }
            }
        })

        if (isNetworkAvailable()) {
            webView.loadUrl(webUrl)
        } else {
            showOfflineScreen()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.supportZoom = true
        settings.builtInZoomControls = true
        settings.displayZoomControls = false

        if (isNetworkAvailable()) {
            settings.cacheMode = WebSettings.LOAD_DEFAULT
        } else {
            settings.cacheMode = WebSettings.LOAD_CACHE_ELSE_NETWORK
        }

        webView.webViewClient = SiliconWebViewClient()
        webView.webChromeClient = SiliconWebChromeClient()

        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
            try {
                val request = DownloadManager.Request(Uri.parse(url))
                request.setMimeType(mimetype)
                val cookies = CookieManager.getInstance().getCookie(url)
                request.addRequestHeader("cookie", cookies)
                request.addRequestHeader("User-Agent", userAgent)
                request.setDescription("Downloading file from Silicon Product...")
                request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype))
                request.allowScanningByMediaScanner()
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                request.setDestinationInExternalPublicDir(
                    Environment.DIRECTORY_DOWNLOADS,
                    URLUtil.guessFileName(url, contentDisposition, mimetype)
                )
                val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                dm.enqueue(request)
                Toast.makeText(applicationContext, "Starting Download...", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(applicationContext, "Download failed", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun showOfflineScreen() {
        webView.visibility = View.GONE
        offlineLayout.visibility = View.VISIBLE
    }

    inner class SiliconWebViewClient : WebViewClient() {
        override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
            super.onPageStarted(view, url, favicon)
            progressBar.visibility = View.VISIBLE
        }

        override fun onPageFinished(view: WebView?, url: String?) {
            super.onPageFinished(view, url)
            progressBar.visibility = View.GONE
            swipeRefreshLayout.isRefreshing = false
        }

        override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
            val url = request?.url?.toString() ?: return false
            if (url.contains("yourwebsite.com") || url.contains("run.app") || url.startsWith("file://")) {
                return false
            }
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(intent)
                return true
            } catch (e: Exception) {
                return false
            }
        }

        override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
            if (request?.isForMainFrame == true) {
                showOfflineScreen()
            }
        }
    }

    inner class SiliconWebChromeClient : WebChromeClient() {
        override fun onProgressChanged(view: WebView?, newProgress: Int) {
            super.onProgressChanged(view, newProgress)
            progressBar.progress = newProgress
        }

        override fun onShowFileChooser(
            webView: WebView?,
            filePathCallback: ValueCallback<Array<Uri>>?,
            fileChooserParams: FileChooserParams?
        ): Boolean {
            fileUploadCallback?.onReceiveValue(null)
            fileUploadCallback = filePathCallback

            var takePictureIntent: Intent? = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            if (takePictureIntent?.resolveActivity(packageManager) != null) {
                var photoFile: File? = null
                try {
                    photoFile = createImageFile()
                } catch (ex: IOException) {
                    Log.e("WebView", "Unable to create Image File", ex)
                }

                if (photoFile != null) {
                    cameraPhotoPath = "file:" + photoFile.absolutePath
                    val photoURI = FileProvider.getUriForFile(
                        this@MainActivity,
                        "com.siliconproduct.app.fileprovider",
                        photoFile
                    )
                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
                } else {
                    takePictureIntent = null
                }
            }

            val contentSelectionIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "*/*"
            }

            val intentArray: Array<Intent?> = takePictureIntent?.let { arrayOf(it) } ?: arrayOfNulls(0)
            val chooserIntent = Intent(Intent.ACTION_CHOOSER).apply {
                putExtra(Intent.EXTRA_INTENT, contentSelectionIntent)
                putExtra(Intent.EXTRA_TITLE, "Upload Product Invoice or Avatar")
                putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray)
            }

            startActivityForResult(chooserIntent, INPUT_FILE_REQUEST_CODE)
            return true
        }
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val imageFileName = "JPEG_" + timeStamp + "_"
        val storageDir: File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(imageFileName, ".jpg", storageDir).apply {
            cameraPhotoPath = absolutePath
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != INPUT_FILE_REQUEST_CODE || fileUploadCallback == null) {
            super.onActivityResult(requestCode, resultCode, data)
            return
        }

        var results: Array<Uri>? = null
        if (resultCode == Activity.RESULT_OK) {
            if (data == null || data.data == null) {
                if (cameraPhotoPath != null) {
                    results = arrayOf(Uri.parse(cameraPhotoPath))
                }
            } else {
                val dataString = data.dataString
                if (dataString != null) {
                    results = arrayOf(Uri.parse(dataString))
                }
            }
        }
        fileUploadCallback?.onReceiveValue(results)
        fileUploadCallback = null
    }
}`
    },
    manifest: {
      name: 'AndroidManifest.xml',
      path: '/android/app/src/main/AndroidManifest.xml',
      lang: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.siliconproduct.app">

    <!-- Native Network Capabilities -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- File Storage & Download Manager Permissions -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    
    <!-- Camera Permissions for File Upload & Scanning -->
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SiliconProduct"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Secure file sandbox sharing for hardware camera capture -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="com.siliconproduct.app.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>

</manifest>`
    },
    layout: {
      name: 'activity_main.xml',
      path: '/android/app/src/main/res/layout/activity_main.xml',
      lang: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#FFFFFF">

    <!-- Top Loading Indicator (Chrome-style bar) -->
    <ProgressBar
        android:id="@+id/progressBar"
        style="@android:style/Widget.ProgressBar.Horizontal"
        android:layout_width="match_parent"
        android:layout_height="4dp"
        android:layout_alignParentTop="true"
        android:max="100"
        android:progressDrawable="@drawable/progress_bar_horizontal"
        android:visibility="gone"
        android:elevation="4dp" />

    <!-- Pull-to-refresh component layout -->
    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefresh"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/progressBar">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

    <!-- Custom Offline Fallback Overlay Layout -->
    <RelativeLayout
        android:id="@+id/offlineLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#111827"
        android:visibility="gone"
        android:padding="24dp">

        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerInParent="true"
            android:gravity="center"
            android:orientation="vertical">

            <ImageView
                android:layout_width="80dp"
                android:layout_height="80dp"
                android:src="@android:drawable/stat_sys_warning"
                android:contentDescription="No Connection Warning"
                app:tint="#F59E0B"
                android:layout_marginBottom="18dp"/>

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Silicon Connect Offline"
                android:textColor="#FFFFFF"
                android:textSize="22sp"
                android:textStyle="bold"
                android:layout_marginBottom="8dp"/>

            <TextView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="We are unable to establish a secure link with the Silicon Product servers. Please verify your mobile connection."
                android:textColor="#9CA3AF"
                android:gravity="center"
                android:textSize="14sp"
                android:layout_marginBottom="24dp"/>

            <Button
                android:id="@+id/btnRetry"
                android:layout_width="220dp"
                android:layout_height="50dp"
                android:text="Retry Connection"
                android:textAllCaps="false"
                android:textSize="16sp"
                android:textColor="#FFFFFF"
                android:background="@drawable/btn_primary_selector"
                android:elevation="4dp"/>

        </LinearLayout>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_alignParentBottom="true"
            android:layout_centerHorizontal="true"
            android:text="Silicon Product Android App v2.4.0"
            android:textColor="#4B5563"
            android:textSize="11sp"
            android:fontFamily="monospace"
            android:layout_marginBottom="16dp"/>

    </RelativeLayout>

</RelativeLayout>`
    },
    gradle: {
      name: 'build.gradle',
      path: '/android/app/build.gradle',
      lang: 'groovy',
      code: `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    compileSdk 34

    defaultConfig {
        applicationId "com.siliconproduct.app"
        minSdk 26 // Android 8.0 Oreo
        targetSdk 34
        versionCode 24
        versionName "2.4.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = '17'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}`
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-10">
      
      {/* Overview Intro */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
              <Smartphone className="w-4 h-4 animate-bounce-slow" />
              <span>NATIVE ANDROID INTEGRATION SUITE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Silicon Product WebView SDK</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Below is the comprehensive, production-ready Android Studio project files structure written in native **Kotlin**.
              Designed with Material Design 3 guidelines, custom progress loaders, full camera capture sandbox compatibility, Swipe-to-refresh integration, and robust offline handlers.
            </p>
          </div>

          <div className="flex gap-3 bg-neutral-950 p-2 rounded-2xl border border-neutral-800/80">
            <div className="text-center px-4 py-2 border-r border-neutral-900">
              <span className="block text-xl font-bold font-mono text-blue-400">8.0+</span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Min SDK</span>
            </div>
            <div className="text-center px-4 py-2 border-r border-neutral-900">
              <span className="block text-xl font-bold font-mono text-emerald-400">100%</span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Kotlin Native</span>
            </div>
            <div className="text-center px-4 py-2">
              <span className="block text-xl font-bold font-mono text-amber-500">AAB</span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-neutral-900/40 p-4 rounded-2xl border border-neutral-900 flex gap-3 items-start hover:border-neutral-800 transition">
          <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-200">HTTPS Enclave Only</h4>
            <p className="text-[11px] text-neutral-400">Forces SSL verification, DOM Storage and secure browser sessions.</p>
          </div>
        </div>

        <div className="bg-neutral-900/40 p-4 rounded-2xl border border-neutral-900 flex gap-3 items-start hover:border-neutral-800 transition">
          <Smartphone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-200">Back Nav & Double Exit</h4>
            <p className="text-[11px] text-neutral-400">Prevents immediate exit, routes navigation natively through WebView history.</p>
          </div>
        </div>

        <div className="bg-neutral-900/40 p-4 rounded-2xl border border-neutral-900 flex gap-3 items-start hover:border-neutral-800 transition">
          <HardDrive className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-200">Adaptive Cache Node</h4>
            <p className="text-[11px] text-neutral-400">Saves visited eCommerce pages locally to load immediately while offline.</p>
          </div>
        </div>

        <div className="bg-neutral-900/40 p-4 rounded-2xl border border-neutral-900 flex gap-3 items-start hover:border-neutral-800 transition">
          <Cpu className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-200">Hardware Accel</h4>
            <p className="text-[11px] text-neutral-400">Leverages native GPU layers to render CSS/JS interfaces at 120Hz smooth.</p>
          </div>
        </div>

      </div>

      {/* Code Browser */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Navigation Bar */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2.5 overflow-x-auto">
            {Object.keys(fileContents).map((key) => {
              const fileKey = key as keyof typeof fileContents;
              const isSelected = activeFile === fileKey;
              return (
                <button
                  key={key}
                  onClick={() => { setActiveFile(fileKey); }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                    isSelected ? 'bg-blue-600 text-white font-semibold' : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  {fileContents[fileKey].name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleCopy(fileContents[activeFile].code)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs font-semibold text-blue-400 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File Code</span>
              </>
            )}
          </button>
        </div>

        {/* File Path Header */}
        <div className="px-6 py-2 bg-neutral-950/60 border-b border-neutral-800/40 text-[10px] font-mono text-neutral-500">
          WORKSPACE ROUTE: {fileContents[activeFile].path}
        </div>

        {/* Code Field */}
        <div className="relative">
          <pre className="p-6 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto max-h-[500px] bg-neutral-950/45">
            <code>{fileContents[activeFile].code}</code>
          </pre>
        </div>

      </div>

      {/* Developer FAQ */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          WebView Deployment Quick Guide
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-2">
            <h4 className="text-xs font-mono font-bold text-blue-400 uppercase">1. Setting up Android Studio</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Create a new project selecting "Empty Activity". Paste the provided <span className="font-mono text-neutral-200">MainActivity.kt</span> inside your main package folder. Ensure your gradle configuration mirrors the compiler settings.
            </p>
          </div>

          <div className="p-5 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-2">
            <h4 className="text-xs font-mono font-bold text-blue-400 uppercase">2. Inject Deployed Domain URL</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Inside <span className="font-mono text-neutral-200">MainActivity.kt</span>, edit the constant variable <span className="font-mono text-neutral-200">webUrl</span> with the secure HTTPS URL of this deployed website layout to sync it instantly with the WebView.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
