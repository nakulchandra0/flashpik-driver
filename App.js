/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
console.disableYellowBox = true;
import React from 'react';
import { AppRegistry, Platform, Dimensions, View, Image, StatusBar, Text } from 'react-native';
var { width, height } = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Color from './source/component/color'
import Font from './source/component/font'

import { AnimatedCircleBarComponent } from 'react-navigation-custom-bottom-tab-component/AnimatedCircleBarComponent';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
// import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

// Import Custom Sidebar
import CustomSidebarMenu from './source/component/sidemenu';

import Splash from './source/pages/splash';
import Intro from './source/pages/introduction';
import Signup from './source/pages/signup/index';
import Signin from './source/pages/signin/index';
import Reset from './source/pages/reset/index';

import Home from './source/pages/welcome/index';
import Account from './source/pages/signin/index';

import Order from './source/pages/orders/index'

import Profile from './source/pages/profile/index'

import About from './source/pages/about/index'
import Notification from './source/pages/notification/index'
import Dispute from './source/pages/dispute/index'

import Disputedetail from './source/pages/dispute/chat' 
//TypeError: Super expression must either be null or a function

import Job from './source/pages/job/index'
import Payment from './source/pages/paymentDetail/index'
import Reviews from './source/pages/reviews/index'
import Setting from './source/pages/setting/index'

import VehicleManagement from './source/pages/vehicleManagement/index';
import AddVehicle from './source/pages/addVehicle/index';
import EditVehicle from './source/pages/editVehicle/index';

import DocumentManagement from './source/pages/documentManagement/index';
import UploadLicence from './source/pages/uploadLicence/index';
import UploadAdharCard from './source/pages/uploadAdharCard/index';
import UploadBankDetail from './source/pages/uploadBankDetail/index';

import RideDetail from './source/pages/rideDetail/index';
import Pickup from './source/pages/pickup/index'
import PickUpImage from './source/pages/pickupImage/index';
import DropOff from './source/pages/dropOff/index';
import DropOffImage from './source/pages/dropoffImage/index';
import DropOffDetail from './source/pages/dropoffDetail/index';
import Trips from './source/pages/trips/index';

// import Details from './source/pages/details/index';

// const WelcomeStack = createStackNavigator(
//   {
//     WelcomeHome: {
//       screen: Home,
//       navigationOptions: {
//         gesturesEnabled: false,
//         header: null,
//       }
//     },
//   },
//   {
//     initialRouteName: 'WelcomeHome',
//   }
// );

const Navigation = createStackNavigator(
  {
    // Menu: {
    //   screen: Splash,
    //   navigationOptions: {
    //     gesturesEnabled: false,
    //     header: null,
    //     drawerLockMode: 'unlocked',
    //   }
    // },
    Main: {
      screen: Home,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Splash: {
      screen: Splash,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
        drawerLockMode: 'unlocked',
      }
    },
    Intro: {
      screen: Intro,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
        drawerLockMode: 'unlocked',
      }
    },
    Signup: {
      screen: Signup,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
        drawerLockMode: 'unlocked',
      }
    },
    Signin: {
      screen: Signin,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
        drawerLockMode: 'unlocked',
      }
    },
    Reset: {
      screen: Reset,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
        drawerLockMode: 'unlocked',
      }
    },
    Reviews: {
      screen: Reviews,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Setting: {
      screen: Setting,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Payment: {
      screen: Payment,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    About: {
      screen: About,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Notification: {
      screen: Notification,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Dispute: {
      screen: Dispute,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Disputedetail: {
      screen: Disputedetail,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    VehicleManagement: {
      screen: VehicleManagement,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    AddVehicle: {
      screen: AddVehicle,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    EditVehicle: {
      screen: EditVehicle,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    DocumentManagement: {
      screen: DocumentManagement,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    UploadLicence: {
      screen: UploadLicence,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    UploadAdharCard: {
      screen: UploadAdharCard,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    UploadBankDetail: {
      screen: UploadBankDetail,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Pickup: {
      screen: Pickup,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    PickUpImage: {
      screen: PickUpImage,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    DropOff: {
      screen: DropOff,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    DropOffImage: {
      screen: DropOffImage,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    DropOffDetail: {
      screen: DropOffDetail,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Trips: {
      screen: Trips,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    RideDetail: {
      screen: RideDetail,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Job: {
      screen: Job,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      }
    },
    // Details: {
    //   screen: Details,
    //   navigationOptions: {
    //     gesturesEnabled: false,
    //     header: null,
    //   }
    // }
  },
  {
    initialRouteName: 'Splash',
    mode: 'slide',
    navigationOptions: {
      gesturesEnabled: false
    }
  });

Navigation.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'locked-closed';
  // if (navigation.state.routes[0].routeName == "Main" || navigation.state.routes[0].routeName == "Job" ) {
  //   drawerLockMode = 'unlocked';
  // }
  if (navigation.state.routes[0].routeName == "Profile" || navigation.state.routes[0].routeName == "Main" || navigation.state.routes[0].routeName == "Job") {
    drawerLockMode = 'unlocked';
  }
  return {
    drawerLockMode,
  };
};

const DrawerNavigator = createDrawerNavigator({

  Main: {
    screen: Navigation,
    navigationOptions: {
      header: null,
      //drawerLockMode:'locked-open',
    }
  },
},
  {
    initialRouteName: 'Main',
    drawerType: 'back',
    contentComponent: CustomSidebarMenu,
    drawerWidth: Dimensions.get('window').width - Dimensions.get('window').width * 25 / 100,
    overlayColor: Color.transparent,
  }
);

const AppNavigator = createSwitchNavigator({
  Home: DrawerNavigator,
});

const AppContainer = createAppContainer(AppNavigator);


export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
};

