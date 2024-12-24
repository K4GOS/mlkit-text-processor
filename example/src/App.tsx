// import {
//   getDownloadedTranslationModels,
//   uninstallLanguageModel,
//   // useTextRecognition,
// } from 'react-native-mlkit-text-processor';
import { useRef } from 'react';
import { Button, Text, View } from 'react-native';
import {
  Camera,
  runAsync,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  // useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-worklets-core';

export default function App() {
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  const format = useCameraFormat(device, [
    { videoResolution: { width: 3048, height: 2160 } },
    { fps: 'max' },
  ]);

  // const { getTextFromFrame } = useTextRecognition();
  // const [isLoading, setIsLoading] = useState(false);

  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   runAsync(frame, () => {
  //     'worklet';
  //     const blocks = getTextFromFrame(frame);
  //     console.log(blocks);
  //   });
  // }, []);
  const blocksCoords = useSharedValue<any[]>([]);
  const paint = Skia.Paint();
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeWidth(5);

  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet';
    runAsync(frame, () => {
      'worklet';
      const blocks: any[] = [];

      if (blocks.length > 0) {
        blocksCoords.value = blocks.filter((block) => block.dimensions);
      } else {
        blocksCoords.value = [];
      }
    });
    frame.render();

    const BORDER_RADIUS = 15;
    for (const blockCoord of blocksCoords.value) {
      paint.setColor(
        Skia.Color(!blockCoord.isJapanese ? '#f58d42' : '#42f569')
      );
      const roundedRect = Skia.RRectXY(
        Skia.XYWHRect(
          blockCoord.dimensions.originX,
          blockCoord.dimensions.originY,
          blockCoord.dimensions.width,
          blockCoord.dimensions.height
        ),
        BORDER_RADIUS,
        BORDER_RADIUS
      );
      frame.drawRRect(roundedRect, paint);
    }
  }, []);

  const cameraRef = useRef<Camera>(null);

  //   const getTranslationAsync = async () => {
  //     setIsLoading(true);
  //     const res = await translateJapaneseText(
  //       `沖縄のアメリカ軍基地に所属する空軍兵による少女への性暴力事件を受けて、22日沖縄市で大規模な抗議集会が開かれ、被害者への謝罪や補償などを求める決議が採択されました。

  // 沖縄では去年12月、嘉手納基地に所属するアメリカ空軍の25歳の兵長が、面識のない16歳未満の少女にわいせつ目的で声をかけて自宅に連れ込み、性的暴行をした罪に問われる事件が起き、1審の那覇地方裁判所は今月13日、懲役5年の実刑判決を言い渡しました。

  // これを受けて、22日沖縄市では県内の女性団体などが「県民大会」として大規模な抗議集会を開き、主催者の発表でおよそ2500人が参加しました。

  // 集会には沖縄県の玉城知事も参加し「多くの県民が不安のなかで基地と共存させられていることをもっと厳しく、大きく声に出し、行動していかなければならない」と述べました。

  // また若者の代表として沖縄県出身の大学3年生、崎浜空音さんが「どうして自分の青春を沖縄に生まれたから、基地があるから、ということで奪われなければならないのか。もう事件を繰り返してはなりません」と訴えました。

  // 集会ではこのあと、兵長やアメリカ軍が被害者に謝罪・補償を行うことや、同じような事件が再び起きた場合、日米両政府は速やかに沖縄県に情報を共有することなどを求める決議が採択されました。

  // 主催者側はこの決議を日米両政府に届けることにしています。`,
  //       'de'
  //     );
  //     setIsLoading(false);
  //     console.log(res);
  //   };

  if (!hasPermission)
    return (
      <Text style={{ backgroundColor: 'red', color: 'white' }}>
        No permission
      </Text>
    );
  if (device == null)
    return (
      <Text style={{ backgroundColor: 'red', color: 'white' }}>No device</Text>
    );

  return (
    <>
      <Camera
        style={{ flex: 1 }}
        ref={cameraRef}
        device={device}
        frameProcessor={frameProcessor}
        enableFpsGraph
        format={format}
        focusable
        isActive
        photo
        pixelFormat="yuv"
        fps={[format?.minFps || 0, format?.maxFps || 30]}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          width: 100,
          alignSelf: 'center',
        }}
      >
        <Button
          title="Start"
          onPress={async () => {
            // await uninstallLanguageModel('fr');
            // const downloadedModels = await getDownloadedTranslationModels();
            // console.log(downloadedModels);
          }}
        />
      </View>
    </>
  );
}
