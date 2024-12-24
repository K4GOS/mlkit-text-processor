#import "MlkitTextProcessor.h"
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>



@implementation MlkitTextProcessor
RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeMlkitTextProcessorSpecJSI>(params);
}


@end

// VISION_EXPORT_SWIFT_FRAME_PROCESSOR(VisionCameraTextRecognition, detectFaces)

//#import <React/RCTBridgeModule.h>
//#import <React/RCTViewManager.h>
//
//@interface RCT_EXTERN_MODULE(TranslateTextModel, NSObject)
//
//RCT_EXTERN_METHOD(translateJapaneseText:(NSString *)japaneseText
//                 (NSString *)targetLanguage
//                 withResolver:(RCTPromiseResolveBlock)resolve
//                 withRejecter:(RCTPromiseRejectBlock)reject)
//
//+ (BOOL)requiresMainQueueSetup
//{
//  return NO;
//}
//
//@end
