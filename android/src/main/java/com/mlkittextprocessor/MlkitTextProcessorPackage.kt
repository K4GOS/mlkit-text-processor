package com.mlkittextprocessor

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import java.util.HashMap

class MlkitTextProcessorPackage : BaseReactPackage() {

  companion object {
    init {
      FrameProcessorPluginRegistry.addFrameProcessorPlugin("getTextFromFrame") { proxy, options ->
        VisionCameraTextRecognitionPlugin(proxy, options)
      }
    }
  }
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return emptyList()
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == MlkitTextProcessorModule.NAME) {
      MlkitTextProcessorModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      moduleInfos[MlkitTextProcessorModule.NAME] = ReactModuleInfo(
        MlkitTextProcessorModule.NAME,
        MlkitTextProcessorModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        true,  // hasConstants
        false,  // isCxxModule
        true // isTurboModule
      )
      moduleInfos
    }
  }
}
