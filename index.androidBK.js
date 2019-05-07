import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  Share,
  NetInfo,
  ToastAndroid,
  Dimensions
} from 'react-native'
import I18n from 'react-native-i18n'
import RadioButton from 'radio-button-react-native'
import { 
  AdMobBanner, 
  AdMobInterstitial, 
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'
var RNFS = require('react-native-fs');
var SendIntentAndroid = require('react-native-send-intent');


export default class giphyApp extends Component {
  constructor(props){
    super(props);
    this.state = {
      url : false,
      status: false,
      //nRefreshGif: false,
      netInfo: false,
      button: true,
      gifSite: 0,
    };

   // nRefreshGif = 0;
    //this.setState({nRefreshGif: nRefreshGif});
    this._refreshGif();
    NetInfo.fetch().done((reach) => {
      console.log('Initial: ' + reach);
      this.setState({netInfo: reach});
    });
  }

  _shareFile(gifUrl){
    var det = this 
      var pathGif = RNFS.ExternalStorageDirectoryPath+'/Download/test.gif'
      var urlGif =  det.state.url
      console.log(pathGif + " <=> " +urlGif );

       RNFS.downloadFile({fromUrl:urlGif, toFile: pathGif}).promise.then(res => {
         this.setState({
           downloaded: true
         });
       });

       SendIntentAndroid.openChooserWithOptions({
       subject: 'Funny gif',
       text: '',
       imageUrl: 'file://'+RNFS.ExternalStorageDirectoryPath+'/Download/test.gif'
      }, 'Share');
    
  }

  _saveFile(gifUrl){
   var det = this 
     var now = new Date() 
     var nameInit = now.getTime()
     RNFS.mkdir(RNFS.ExternalStorageDirectoryPath+'/FunnyGifs/')
     var pathGif = RNFS.ExternalStorageDirectoryPath+'/FunnyGifs/'+nameInit+'.gif'
     var urlGif =  det.state.url
     

      RNFS.downloadFile({fromUrl:urlGif, toFile: pathGif}).promise.then(res => {
        this.setState({
          downloaded: true
        });
        ToastAndroid.showWithGravity(I18n.t('gifSaved'), ToastAndroid.SHORT, ToastAndroid.CENTER);
      });
  }

  _saveData(text) {
    try {
      AsyncStorage.setItem('@MySuperStore:key', text);
    } catch (error) {
      console.log(error);
    }
  }
  
  _refreshGif() {
    this._checkGif()
    var det = this
    AsyncStorage.getItem('@MySuperStore:key', function(err, val) {
      picPreference = "";
      if (err == null) {
        picPreference = val;
      } 
      if (val =="" || val == null){
        picPreference = "cats funny";
      }

     /* var nRefreshGif = det.state.nRefreshGif + 1
      det.setState({nRefreshGif: nRefreshGif});*/
      det.setState({picPreference: picPreference})
     // if (det.state.nRefreshGif % 8 !== 0) {
        if(det.state.gifSite == 1){
          request.open('GET', 'https://api.tenor.com/v1/search?key=LIVDSRZULELA&q='+picPreference+'&limit=50');
        } else if (det.state.gifSite == 0){
          request.open('GET', 'https://api.giphy.com/v1/gifs/random?api_key=c4297a2085864530a8c36a11d64ea7ae&tag=' + picPreference + '&rating=G');
        } 
        request.send();
      /*} else {
        det.setState({button: false});
        det.setState({url:false});
      }*/
    });
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        imageUrl = JSON.parse(request.responseText);
        if (det.state.gifSite == 0){
          if (det.state.netInfo == "MOBILE"){
            imageUrl = imageUrl.data.fixed_width_downsampled_url
          } else if(det.state.netInfo == "WIFI") {
            imageUrl = imageUrl.data.fixed_height_downsampled_url
          }
        } else if (det.state.gifSite == 1){
          randomResult = Math.floor((Math.random() * 50) + 1);
          if (det.state.netInfo == "MOBILE"){
            imageUrl = imageUrl.results[randomResult].media[0].nanogif.url
          } else if(det.state.netInfo == "WIFI") {
            imageUrl = imageUrl.results[randomResult].media[0].mediumgif.url
          }
        } 
        this.setState({
          url: imageUrl
        })
        
      } else {
        console.log("error");
      }
    };

  }

  _checkGif() {
    var path = RNFS.ExternalStorageDirectoryPath+'/Download/test.gif';
    return RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err.message);
      });
  }

  _toggleStatus(){
    if (this.state.status == true){
      this.setState({status:false});
    } else {
      this.setState({status:true});
     this._refreshGif();
    } 
  }

  _handleOnPress(value){
    this.setState({gifSite:value})
  }

  _showBannerOrGif(){
    /*var det = this
    console.log("numero refresh " + det.state.nRefreshGif);
    if(det.state.nRefreshGif % 8 === 0 && !det.state.status){
      return _adv
    } else {
      return _img
    }*/
    return _img
  }

  _showButton(){
    var det = this
    if(!det.state.status){
          console.log("check button A");
      return _buttonHappy
    } else {
        console.log("check button A");
      return _buttonSaveOptions
    }
  }

  _counter(){
    console.log("counter function " + this.state.button)
    setTimeout(() => {this.setState({button:true}),console.log("counter function " + this.state.button)}, 3000)
  }

  render() {
      var picPreference = (!!this.state.picPreference)
       _img = (!!this.state.url && !this.state.status)
          ? <Image
             style={styles.imageStyle}
              resizeMode="contain"
              source={{uri: this.state.url}}  />
          : (this.state.netInfo == "NONE")
              ?<Text>{I18n.t('infoConnection')}</Text>
              :(!this.state.status)?<Text>{I18n.t('wait')}</Text>:<Text></Text>;
       _adv = <AdMobBanner
          bannerSize="mediumRectangle"
          adUnitID="ca-app-pub-8759822971567973/6483251215"
          testDeviceID=""
          adViewDidReceiveAd={ () => { console.log('adViewDidReceiveAd'), this._counter() } }
          didFailToReceiveAdWithError={ (e) => { console.log('didFailToReceiveAdWithError ', e); } }
        />
      _menu =(this.state.status)
        ? <View style={{backgroundColor:'#b8d9ba',paddingBottom:50}}>
            <Text style={styles.textOptionTitle}>{I18n.t('findKeyWord')}</Text>
            <TextInput
              style={styles.imputForm}
              onChangeText={(text) => this.setState({text:text}),(text) => this._saveData(text)}
              defaultValue={this.state.picPreference}
              value={this.state.text}
            />
            <Text style={styles.textOptionTitle}>{I18n.t('host')}</Text>
            <View style={{paddingLeft:15, paddingTop:15}}>
              <RadioButton style={styles.inputRadio} currentValue={this.state.gifSite} value={0} onPress={this._handleOnPress.bind(this)}>
                <Text style={styles.inputRadioText}>Giphy</Text>
              </RadioButton>  
            </View>   
            <View style={{paddingLeft:15, paddingTop:10}}>    
              <RadioButton style={styles.inputRadio} currentValue={this.state.gifSite} value={1} onPress={this._handleOnPress.bind(this)}>
                <Text style={styles.inputRadioText}>Tenor</Text>
              </RadioButton>
            </View>
          </View>
        : <Text></Text> ;
      _buttonSaveOptions =  
         <View style={styles.buttonSaveOptions}>
          <TouchableOpacity  onPress={() => this._toggleStatus()} >
            <Text style={styles.textButtonFelicity}>{I18n.t('buttonSaveOptions')}</Text>
          </TouchableOpacity>
        </View>;
             
      _buttonHappy = <View style={styles.buttonFelicity}>
          <TouchableOpacity  onPress={() => this._refreshGif()} >
            <Text style={styles.textButtonFelicity}>{I18n.t('button')}</Text>
          </TouchableOpacity>
        </View>;
       

    return (
      <View style={styles.container}>
        <Image
          style={styles.bg}
          resizeMode="cover"
          source={require('./android/app/src/main/res/mipmap-hdpi/bg2.jpg')} 
        />
        <Image
            style={styles.welcome}
            source={require('./android/app/src/main/res/mipmap-hdpi/stresskill.png')}
          />
          {_menu}
          {this._showBannerOrGif()}
          {this._showButton()}
      <View style={styles.toolbar}>
        <TouchableOpacity  onPress={() => this._saveFile()} style={styles.saveBottom}>
          <Image
            style={{width: 24, height: 24}}
            source={require('./android/app/src/main/res/mipmap-hdpi/save.png')}
          />
        </TouchableOpacity>  
        <TouchableOpacity  onPress={() => this._shareFile()} style={styles.shareBottom}>
          <Image
            style={{width: 24, height: 24}}
            source={require('./android/app/src/main/res/mipmap-hdpi/share.png')}
          />
        </TouchableOpacity>
       <TouchableOpacity  onPress={() => this._toggleStatus()} style={styles.menuBottom}>
          <Image
            style={{width: 24, height: 24}}
            source={require('./android/app/src/main/res/mipmap-hdpi/settings.png')}
          />
        </TouchableOpacity>
        </View>
      </View>  
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffcc'
  },
  buttonFelicity:{
    marginTop: 10, 
    padding:7, 
    color:"#000",  
    backgroundColor:"#4ddbff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff'
  },
  buttonSaveOptions:{
    marginTop: 10, 
    padding:7, 
    color:"#fff",  
    backgroundColor:"#4ddbff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff'
  },
  textButtonFelicity:{
    fontFamily:'monospace', 
    fontSize:20, 
    fontWeight:"bold", 
    textAlign:"center"
  },
  bg:{
    height: Dimensions.get('window').height, 
    width: Dimensions.get('window').width,
    position:'absolute',
    zIndex: 0
  },
  toolbar:{
        backgroundColor:'#4ddbff',
        paddingTop:5,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:5,
        flexDirection:'row',
        position: 'absolute',
        bottom: 0 ,
        zIndex: 1,
        borderTopWidth: 1,
        borderColor: '#fff'
    },
  welcome: {
    marginTop:20,
    zIndex: 1
  },
  menuBottom: {
    textAlign: 'center'
  },
   shareBottom: {
     textAlign: 'center',
     flex:1
  },
  saveBottom: {
     textAlign: 'center',
     flex:1
  },
  imageStyle: {
    width: 300, 
    height: 300, 
    zIndex: 1
  },
  imputForm: {
    width: Dimensions.get('window').width, 
    fontFamily: 'monospace', 
    backgroundColor:"#b8d9ba",
    marginTop:5,
    textAlign: 'center',
    zIndex: 1
  },
  textOptionTitle: {
    marginTop: 20, 
    fontFamily: 'monospace', 
    fontSize:20, 
    fontWeight:"bold", 
    textAlign: 'center'
  },
  inputRadio: {
    marginBottom: 20, 
    marginLeft: 30,
  },
  inputRadioText: {
    fontSize:16,
    marginLeft: 30,
  }

});

I18n.defaultLocale = 'en-US'
I18n.translations = {
  'en': {
    welcome: 'kill the stress!',
    button: 'Other happiness',
    infoConnection: 'No connection',
    wait: 'Wait...',
    waitFew: 'Wait a few seconds',
    gifSaved: 'Your gif has been saved in this device',
    buttonSaveOptions: 'Save',
    findKeyWord: 'What would you like to see?',
    host: 'Choose an site'
  },
  'en-US': {
    welcome: 'kill the stress!',
    button: 'Other happiness',
    infoConnection: 'No connection',
    wait: 'Wait...',
    waitFew: 'Wait a few seconds',
    gifSaved: 'Your gif has been saved in this device',
    buttonSaveOptions: 'Save',
    findKeyWord: 'What would you like to see?',
    host: 'Choose an site'
  },
  'it-IT': {
    welcome: 'Abbatti lo stress!',
    button: 'Altra felicità',
    infoConnection: 'Connessione assente',
    wait: 'Attendi...',
    waitFew: 'Attendi pochi secondi',
    gifSaved: 'La gif è stata salvata in questo dispositivo',
    buttonSaveOptions: 'Salva',
    findKeyWord: 'Cosa ti piacerebbe vedere?',
    host: 'Scegli un sito'
  }
}








AppRegistry.registerComponent('giphyApp', () => giphyApp);