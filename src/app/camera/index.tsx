import { useCameraStore } from '@/presentation/store/useCameraStore';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { useTheme } from '@/presentation/theme/hooks/use-theme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function CameraScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null)
    const [selectedImage, setSelectedImage] = useState<string>()
    const [galleryPermissions, requestGalleryPermission] = MediaLibrary.usePermissions();
    const { addSelectedImage } = useCameraStore()

    const onRequestPermissions = async () => {
        try {
            const { status: cameraPermissionStatus } = await requestCameraPermission()

            if (cameraPermissionStatus !== 'granted') {
                Alert.alert('error', 'we need camera access')
                return;
            }

            const { status: mediaPermissionStatus } = await requestGalleryPermission()

            if (mediaPermissionStatus !== 'granted') {
                Alert.alert('error', 'we need gallery access')
                return;
            }

        } catch (e) {
            Alert.alert('error', 'something went wrong')
        }
    }

    const onShutterButtonPress = async () => {
        if (!cameraRef.current) return;
        const pic = await cameraRef.current.takePictureAsync({ quality: 0.7 })
        if (!pic.uri) return;
        setSelectedImage(pic.uri)
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const onReturnPress = () => {
        router.dismiss()
    }

    const onConfirmPress = async () => {
        try {
            let currentPermission = galleryPermissions;
            if (!currentPermission?.granted) {
                currentPermission = await requestGalleryPermission();
            }

            if (!currentPermission?.granted) {
                Alert.alert('Permission Denied', 'Gallery access is required to save photos.');
                return;
            }

            if (!selectedImage) return;

            const asset = await MediaLibrary.Asset.create(selectedImage);
            const album = await MediaLibrary.Album.create("expo", [asset]);
            await album.add(asset);

            addSelectedImage(selectedImage)

            router.dismiss()
        } catch (e) {
            Alert.alert('error', 'failed to save pic')
        }

    }

    const onRetakePress = () => {
        setSelectedImage(undefined)
    }

    const onGalleryPress = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            allowsMultipleSelection: true,
            selectionLimit: 5
        });

        if (result.canceled) return;

        result.assets.forEach(asset => {
            addSelectedImage(asset.uri)
        })

        router.dismiss()
    }

    if (!cameraPermission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!cameraPermission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{ ...styles.container, marginHorizontal: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.message}>We need your permission to show the camera and gallery</Text>
                <TouchableOpacity onPress={onRequestPermissions}>
                    <ThemedText>grant permission</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    if (selectedImage) {
        return (<View style={styles.container}>
            <Image source={{ uri: selectedImage }} style={styles.camera} />
            <ConfirmImageButton onPress={onConfirmPress} />
            <ReturnButton onPress={onReturnPress} />
            <RetakeButton onPress={onRetakePress} />
        </View>)
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <ShutterButton onPress={onShutterButtonPress} />
            <FlipCameraButton onPress={toggleCameraFacing} />
            <GalleryButton onPress={onGalleryPress} />
            <ReturnButton onPress={onReturnPress} />
        </View>
    );
}

const ShutterButton = ({ onPress = () => { } }) => {
    const dimensions = useWindowDimensions()
    const primaryColor = useTheme().primary

    return (
        <TouchableOpacity style={[styles.shutterButton, { position: 'absolute', bottom: 30, left: (dimensions.width / 2) - 32, borderColor: primaryColor }]} onPress={onPress}>
        </TouchableOpacity>
    )
}

const ConfirmImageButton = ({ onPress = () => { } }) => {
    const dimensions = useWindowDimensions()
    const primaryColor = useTheme().primary

    return (
        <TouchableOpacity style={[styles.shutterButton, { position: 'absolute', bottom: 30, left: (dimensions.width / 2) - 32, borderColor: primaryColor }]} onPress={onPress}>
            <Ionicons name='checkmark-outline' size={30} color={primaryColor} />
        </TouchableOpacity>
    )
}

const FlipCameraButton = ({ onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
            <Ionicons name='camera-reverse-outline' size={30} color='white' />
        </TouchableOpacity>
    )
}

const RetakeButton = ({ onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
            <Ionicons name='close-outline' size={30} color='white' />
        </TouchableOpacity>
    )
}

const GalleryButton = ({ onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.galleryButton}>
            <Ionicons name='images-outline' size={30} color='white' />
        </TouchableOpacity>
    )
}

const ReturnButton = ({ onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.returnCancelButton}>
            <Ionicons name='arrow-back-outline' size={30} color='white' />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },

    shutterButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
        borderColor: 'red',
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },

    flipCameraButton: {
        width: 50,
        height: 50,
        borderRadius: 32,
        backgroundColor: '#17202A',
        position: 'absolute',
        bottom: 40,
        right: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

    galleryButton: {
        width: 50,
        height: 50,
        borderRadius: 32,
        backgroundColor: '#17202A',
        position: 'absolute',
        bottom: 40,
        left: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

    returnCancelButton: {
        width: 50,
        height: 50,
        borderRadius: 32,
        backgroundColor: '#17202A',
        position: 'absolute',
        top: 40,
        left: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});