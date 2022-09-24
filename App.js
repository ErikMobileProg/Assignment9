import { StyleSheet, View, Button, TextInput, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {

  const key = 'k1tDgHbYqlAa4QzK1TOMJG6nNxD0mmCp';

  const [address, setAddress] = useState('');

  const [data, setData] = useState('');

  const [position, setPosition] = useState({
    latitude: 60.200692,
    longitude: 24.934302
  });

  const [location, setLocation] = useState(null);

  useEffect(() => {

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      setPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })

    })();
    
  }, []);

  const fetchRepository = () => {

    fetch('http://www.mapquestapi.com/geocoding/v1/address?key=' + key + '&location=' + address)
      .then(response => response.json())
      .then(data => setData((((data.results)[0].locations)[0].latLng)))
      .catch(err => Alert.alert('Error', err));

    setPosition({
      latitude: data.lat,
      longitude: data.lng
    });

  }

  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        region={{
          ...position,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}>
        <Marker
          coordinate={{ ...position }}
          title={address}
        />
      </MapView>

      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.textInput}
          placeholder='Type in your address'
          onChangeText={(address) => setAddress(address)}
        />
        <View style={styles.buttonView}>
          <Button title='SHOW' onPress={fetchRepository} />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: Dimensions.get('window').width,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  buttonView: {
    width: Dimensions.get('window').width,
  },
  map: {
    flex: 6,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});