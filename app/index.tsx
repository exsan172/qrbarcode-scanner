import { useCallback, useState } from "react";
import { ToastAndroid, useColorScheme, View, Text, TouchableOpacity, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useFocusEffect } from "expo-router";
import Components from "@/components";
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
    const colorScheme = useColorScheme()
    const [activeCamera, setActiveCamera] = useState<boolean>(false)
    const [valueScanned, setValueScanned] = useState<string | null>(null)
    const [isCopy, setIsCopy]             = useState<boolean>(false)

    const device        = useCameraDevice('back')
    const codeScanner   = useCodeScanner({
        codeTypes: ["qr", "ean-13", "code-128", "code-39", "code-93", "codabar"],
        onCodeScanned: (codes) => {
            if(codes[0].value !== undefined) {
                setValueScanned(codes[0].value)
                setActiveCamera(false)

            } else {
                ToastAndroid.show("QRCode atau Barcode Tidak di temukan !", ToastAndroid.SHORT)
            }
        }
    });

    const checkPermission = async () => {
        const status = await Camera.getCameraPermissionStatus();
        if(status === "denied") {
            await Camera.requestCameraPermission()
        }
    }

    const copyToClipboard = async (value:string) => {
        await Clipboard.setStringAsync(value);
        setIsCopy(true)

        setTimeout(() => {
            setIsCopy(false)
        }, 1000)
    };

    const openLink = (link:string) => {
        Linking.openURL(link)
    }

    const isValidUrl = (value: string): boolean => {
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/[^\s]*)?$/i;
        return urlPattern.test(value);
    };

    useFocusEffect(
        useCallback(() => {
            checkPermission()

            return () => {
                setActiveCamera(false)
            }
        }, [])
    )

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-white dark:bg-black">
                {
                    activeCamera ?
                        <View className="flex-1">
                            <View className="flex-1">
                                <Camera
                                    isActive={activeCamera}
                                    device={device as any}
                                    codeScanner={codeScanner}
                                    style={{ flex:1 }}
                                />
                            </View>
                            <View className="w-full px-4 py-4">
                                <Components.Button
                                    label="Batal"
                                    onPress={() => setActiveCamera(false)}
                                    icon={<AntDesign name="closecircle" size={24} color="white" className="mr-2" />}
                                />
                            </View>
                        </View>
                    :
                        <View className="flex-1 p-4">
                            <View className="flex-1 items-center justify-center">
                                <AntDesign name="qrcode" size={150} color={colorScheme === "dark" ? "white" : "black"} />
                            </View>
                            <View className="w-full">
                                <View className="mb-4 border border-gray-400 py-5 pl-6 pr-4 min-h-[70px] rounded-xl flex-row items-center">
                                    <View className="w-11/12">
                                        <Text className={`font-medium ${colorScheme === "dark" ? "text-white" : "text-gray-500"}`}>{valueScanned !== null ? valueScanned : "Hasilnya akan muncul di sini ya ..."}</Text>
                                    </View>
                                    <View className="w-1/12">
                                        <TouchableOpacity onPress={() => copyToClipboard(valueScanned !== null ? valueScanned : "Hasilnya akan muncul di sini ya ...")} className="flex-row items-center justify-center">
                                            {
                                                isCopy ?
                                                    <AntDesign name="check" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                                                :
                                                    <AntDesign name="copy1" size={20} color={colorScheme === "dark" ? "white" : "black"} />
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setValueScanned(null)} className="flex-row items-center justify-center mt-4">
                                            <AntDesign name="close" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                                        </TouchableOpacity>

                                        {
                                            isValidUrl(valueScanned !== null ? valueScanned : "") &&
                                            <TouchableOpacity onPress={() => openLink(valueScanned !== null ? valueScanned : "https://exsan.my.id")} className="flex-row items-center justify-center mt-4">
                                                <AntDesign name="link" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                                <View>
                                    <Components.Button
                                        label="Mulai Scan"
                                        onPress={() => setActiveCamera(true)}
                                        icon={<AntDesign name="scan1" size={24} color={"white"} className="mr-2"/>}
                                    />
                                    <View className="mt-3">
                                        <Components.Button
                                            label="Buat QR | Barcode"
                                            onPress={() => router.push("/generator")}
                                            icon={<Ionicons name="create-outline" size={24} color="white" className="mr-2" />}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default Home