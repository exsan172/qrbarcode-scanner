import Components from "@/components";
import { View, Text, TextInput, useColorScheme, TouchableOpacity, ToastAndroid } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import QRCode from 'react-native-qrcode-svg';
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useRef, useState } from "react";
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const Generator = () => {
    const colorScheme = useColorScheme()
    const viewShotRef                       = useRef<any>();
    const [valueGenerate, setValueGenerate] = useState<string>("")
    const [showQrcode, setShowQrcode]       = useState<boolean>(false)
    const [showBarcode, setShowBarcode]     = useState<boolean>(false)

    const captureAndShareScreenshot = () => {
        viewShotRef.current.capture().then((uri:string) => {
            Share.open({
                url: uri
            })
            .then((res) => ToastAndroid.show("Berhasil dibagikan !", ToastAndroid.SHORT))
            .catch((err) => ToastAndroid.show("Gagal dibagikan !", ToastAndroid.SHORT));
        });
    };
    
    return (
        <View className="flex-1 bg-white dark:bg-black">
            <View className="flex-1 items-center justify-center p-4">
                <ViewShot 
                    ref={viewShotRef} 
                    options={{ 
                        format: "png", 
                        quality: 0.9,
                        fileName : `${valueGenerate}-${new Date().getTime()}`
                    }}
                >
                    <View>
                        {
                            (!showQrcode && !showBarcode || valueGenerate === "") &&
                            <QRCode value="https://exsan.my.id" backgroundColor={colorScheme === "dark" ? "black" : "white"} color={colorScheme === "dark" ? "white" : "black"} size={150} />
                        }

                        {
                            showQrcode &&
                            valueGenerate !== "" &&
                            <QRCode value={valueGenerate} size={150} backgroundColor={colorScheme === "dark" ? "black" : "white"} color={colorScheme === "dark" ? "white" : "black"} />
                        }

                        {
                            showBarcode &&
                            valueGenerate !== "" &&
                            <Barcode value={valueGenerate} maxWidth={200} background={colorScheme === "dark" ? "black" : "white"} lineColor={colorScheme === "dark" ? "white" : "black"} format="CODE128" />
                        }
                    </View>
                    {
                        (showQrcode || showBarcode) &&
                        <View className="py-2 justify-center items-center">
                            <Text className="text-black dark:text-white font-medium text-lg">{valueGenerate}</Text>
                        </View>
                    }
                </ViewShot>

                <TouchableOpacity onPress={() => captureAndShareScreenshot()} className="mt-6 flex-row items-center">
                    <AntDesign name="sharealt" size={24} color={colorScheme === "dark" ? "white" : "black"} className="mr-3"/>
                    <Text className="text-black dark:text-white font-medium text-lg">Bagikan</Text>
                </TouchableOpacity>
            </View>
            <View className="p-4">
                <View>
                    <TextInput
                        placeholder="Masukan text atau url yang ingin di generate ..."
                        placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
                        value={valueGenerate}
                        onChangeText={(text) => setValueGenerate(text)}
                        className="p-4 bg-white dark:bg-black text-black dark:text-white border border-gray-400 rounded-xl h-[90px] align-top"
                    />
                </View>
                <View className="mt-3">
                    <Components.Button
                        label="Buat QR"
                        onPress={() => {
                            setShowQrcode(true)
                            setShowBarcode(false)
                        }}
                        icon={<AntDesign name="qrcode" size={24} color={"white"} className="mr-2"/>}
                    />
                </View>
                <View className="mt-3">
                    <Components.Button
                        label="Buat Barcode"
                        onPress={() => {
                            setShowBarcode(true)
                            setShowQrcode(false)
                        }}
                        icon={<AntDesign name="barcode" size={24} color="white" className="mr-2" />}
                    />
                </View>
            </View>
        </View>
    )
}

export default Generator;