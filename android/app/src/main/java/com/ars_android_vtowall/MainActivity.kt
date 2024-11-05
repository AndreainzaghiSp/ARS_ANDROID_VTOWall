package com.ars_android_vtowall

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(savedInstanceState)
      checkAndRequestPermissions()
  }

  /**
   * Funzione per verificare e richiedere le autorizzazioni di runtime.
   */
  private fun checkAndRequestPermissions() {
      val permissionsNeeded = mutableListOf<String>()
      if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
          permissionsNeeded.add(Manifest.permission.CAMERA)
      }
      if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
          permissionsNeeded.add(Manifest.permission.RECORD_AUDIO)
      }
      if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
          permissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
      }

      // Se ci sono autorizzazioni da richiedere, mostra il dialogo
      if (permissionsNeeded.isNotEmpty()) {
          ActivityCompat.requestPermissions(this, permissionsNeeded.toTypedArray(), 100)
      }
  }

  /**
   * Gestisci il risultato della richiesta di autorizzazioni.
   */
  override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
      super.onRequestPermissionsResult(requestCode, permissions, grantResults)
      if (requestCode == 100) {
          val permissionsDenied = permissions.zip(grantResults.toTypedArray())
              .filter { it.second != PackageManager.PERMISSION_GRANTED }
              .map { it.first }

          if (permissionsDenied.isNotEmpty()) {
              // Mostra un messaggio all'utente informandolo che l'app necessita di queste autorizzazioni
              println("Le seguenti autorizzazioni sono necessarie: ${permissionsDenied.joinToString(", ")}")
          }
      }
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  override fun getMainComponentName(): String = "ARS_ANDROID_VTOWall"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, false)

}
