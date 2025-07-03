import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export default function Index() {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const camera = useRef<Camera>(null)

  async function click() {
    console.log("this ran")
    if (camera == null) return <Text>nooooooooooooooo</Text>
    const photo = await camera.current?.takePhoto()
    const formdata = new FormData()
    const uri = photo?.path.startsWith('file://') ? photo?.path : `file://${photo?.path}`;
    formdata.append("image", {
      uri: uri,
      name: "photo.jpeg",
      type: `image/jpeg`
    } as unknown as Blob)

    try{
    const response = await fetch("https://10.155.4.68:8000/api/", {
      method: 'POST',
      body: formdata
    })

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;

    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  useEffect(()=>{
    if (!hasPermission){
      requestPermission()
    }
  }, [])
  if (device == null) return <Text>nooooooooooooooo</Text>
  return (
    <>
    <Camera
      style={StyleSheet.absoluteFill}
      ref={camera}
      device={device}
      isActive={true}
      photo={true}
    />
    <View style={styles.container}>
      <Pressable onPress={()=>{click()}}>
        <View style={styles.button}></View>
      </Pressable>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 75,
    height: 75,
    borderWidth: 8,
    borderColor: "white",
    borderRadius: 100
  },
  container: {
    flex: 1,
    zIndex: 999,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50
  }
})