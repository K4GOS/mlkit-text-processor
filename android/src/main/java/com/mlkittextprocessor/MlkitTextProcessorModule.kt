package com.mlkittextprocessor

import android.graphics.BitmapFactory
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.common.model.DownloadConditions
import com.google.mlkit.common.model.RemoteModelManager
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.TranslateRemoteModel
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.TranslatorOptions
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.japanese.JapaneseTextRecognizerOptions
import java.io.File

@ReactModule(name = MlkitTextProcessorModule.NAME)
class MlkitTextProcessorModule(reactContext: ReactApplicationContext) :
  NativeMlkitTextProcessorSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun recognizeTextFromUri(uri: String): WritableArray {
    val file = File(uri)
    if (!file.exists()) {
      throw Exception("File not found at: $uri")
    }

    // Load the image from the URI
    val bitmap = BitmapFactory.decodeFile(file.absolutePath)
    val inputImage = InputImage.fromBitmap(bitmap, 0)

    // Perform text recognition
    val recognizer = TextRecognition.getClient(JapaneseTextRecognizerOptions.Builder().build())
    val visionText = try {
      Tasks.await(recognizer.process(inputImage))
    } catch (e: Exception) {
      throw Exception("Text recognition failed: ${e.message}")
    }
    val res = WritableNativeArray()
    visionText.textBlocks.forEach{textBlock -> res.pushString(textBlock.text.lines().joinToString(""))}
    return res
  }

  override fun translateText(japaneseText: String, targetLanguage: String): String {

    val options = TranslatorOptions.Builder()
      .setSourceLanguage(TranslateLanguage.JAPANESE)
      .setTargetLanguage(targetLanguage)
      .build()
    val japaneseTranslator = Translation.getClient(options)

    val conditions = DownloadConditions.Builder()
      .requireWifi()
      .build()

    try {
      Tasks.await(japaneseTranslator.downloadModelIfNeeded(conditions))
    } catch (e: Exception) {
      e.printStackTrace()
      Log.e("ds","Model has not been downloaded")
    }

    val result = Tasks.await(japaneseTranslator.translate(japaneseText))
    return result;
  }

  override fun translateJapaneseText(
    japaneseText: String,
    targetLanguage: String,
    promise: Promise
  ) {
    val options = TranslatorOptions.Builder()
      .setSourceLanguage(TranslateLanguage.JAPANESE)
      .setTargetLanguage(targetLanguage)
      .build()
    val japaneseTranslator = Translation.getClient(options)

    val conditions = DownloadConditions.Builder()
      .requireWifi()
      .build()

    try {
      Tasks.await(japaneseTranslator.downloadModelIfNeeded(conditions))
    } catch (e: Exception) {
      e.printStackTrace()
      Log.e("Error","Model has not been downloaded")
    }

    val result = Tasks.await(japaneseTranslator.translate(japaneseText))
    promise.resolve(result)
  }

  override fun getDownloadedTranslationModels(promise: Promise) {
    val modelManager = RemoteModelManager.getInstance()
    // Get translation models stored on the device.
    val models = Tasks.await(modelManager.getDownloadedModels(TranslateRemoteModel::class.java))

    promise.resolve(Arguments.createArray().apply { models.forEach { pushString(it.language) } })
  }

  override fun uninstallLanguageModel(targetLanguage: String, promise: Promise) {
    val modelManager = RemoteModelManager.getInstance()
    val modelToDelete = TranslateRemoteModel.Builder(targetLanguage).build()
    Tasks.await(modelManager.deleteDownloadedModel(modelToDelete))
    promise.resolve("Model for language $targetLanguage has been successfully deleted")
  }

  companion object {
    const val NAME = "MlkitTextProcessor"
  }
}
