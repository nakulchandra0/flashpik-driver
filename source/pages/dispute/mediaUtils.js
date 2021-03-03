import { Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
var { width, height } = Dimensions.get('window');

// export async function getLocationAsync(onSend) {
//   if (await getPermissionAsync(Permissions.LOCATION)) {
//     const location = await Location.getCurrentPositionAsync({})
//     if (location) {
//       onSend([{ location: location.coords }])
//     }
//   }
// }
    
export async function pickImageAsync(onSend) {
    const result = ImagePicker.openPicker({
                    width: width,
                    height: width,
                    cropping: true,
                    includeExif: true
                }).then(image => {
                    console.log('image', image);
                    if (!result.cancelled) {
                      onSend({ image: image.path })
                      return image.path
                    }                
                });
  }

export async function takePictureAsync(onSend) {

    const result = ImagePicker.openCamera({
                    width: 400,
                    height: 400,
                    //multiple: true,
                    //cropping: true,
                    //includeExif: true
                }).then(image => {
                    //this.setState({ isLoading: true });
                    console.log('image', image);
                    // const parcel = {
                    //     uri: image.path,
                    //     type: image.mime,
                    //     name: Platform.OS === 'ios' ? image.filename : 'image.jpg'
                    // }
                    // var image = image.path
                    // onSend([{ image: image }])
                    if (!result.cancelled) {
                      onSend([{ image: result.uri }])
                      return result.uri
                  }
  
                })
                // .catch(e => alert('User cancelled image selection.'));

}