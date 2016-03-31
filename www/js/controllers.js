angular.module('starter.controllers', ["chart.js"])
    .controller('AppCtrl', function() {})
    .controller('DeviceCtrl', function($ionicPlatform, $scope, $cordovaDevice) {
        $ionicPlatform.ready(function() {
            $scope.$apply(function() {
                // sometimes binding does not work! :/
                // getting device infor from $cordovaDevice
                var device = $cordovaDevice.getDevice();
                $scope.manufacturer = "manufacturer";
                $scope.model = device.model;
                $scope.platform = device.platform;
                $scope.uuid = device.uuid;
            });
        });

    })
    .controller('BatteryCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaBatteryStatus) {
        $ionicPlatform.ready(function() {
            // // This code never worked on my Samsung Note III
            // $rootScope.$on('$cordovaBatteryStatus:status', function(result) {
            //     $scope.$apply(function() {
            //         // sometimes binding does not work! :/
            //         $scope.batteryLevel = result.level; // (0 - 100)
            //         $scope.isPluggedIn = result.isPlugged; // bool
            //     });
            // });

            // But this code works!!
            $scope.onBatteryStatus = function(result) {
                $scope.batteryLevel = result.level; // (0 - 100)
                $scope.isPluggedIn = result.isPlugged; // bool
            };
            if (!$rootScope.batteryEvtAttached) {
                // prevent from registering multiple times
                // Ideally needs to be added in .run()
                // This is for the sake of example
                window.addEventListener('batterystatus', $scope.onBatteryStatus, false);
                $rootScope.batteryEvtAttached = true;
            }
        });
    })
    .controller('CameraCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaCamera) {
        $ionicPlatform.ready(function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $scope.takePicture = function() {
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.imgSrc = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    console.log(err);
                });
            }
        });
    })
    .controller('MotionCtrl', function($ionicPlatform, $scope, $timeout, $cordovaDeviceMotion) {
        $ionicPlatform.ready(function() {
            // Values @ this instance
            $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
                $scope.X = result.x;
                $scope.Y = result.y;
                $scope.Z = result.z;
                $scope.timeStamp = result.timestamp;
            }, function(err) {
                // An error occurred. Show a message to the user
                console.log(err);
            });
            // Keep watching for change in values
            // watch Acceleration
            var options = {
                frequency: 2000
            };
            $scope.watch = $cordovaDeviceMotion.watchAcceleration(options);
            $scope.watch.then(
                null,
                function(error) {
                    // An error occurred
                },
                function(result) {
                    $scope.X = result.x;
                    $scope.Y = result.y;
                    $scope.Z = result.z;
                    $scope.timeStamp = result.timestamp;
                });
            $timeout(function() {
                $scope.watch.clearWatch();
                // or
                // $cordovaDeviceMotion.clearWatch(watch)
                // .then(function(result) {
                //   // success
                //   }, function (error) {
                //   // error
                // });
            }, 10000);
        });
    })
    .controller('NotificationsCtrl', function($ionicPlatform, $scope, $cordovaLocalNotification) {
        $ionicPlatform.ready(function() {
            $scope.notify = function() {
                $cordovaLocalNotification.add({
                    id: 'welcome_notif',
                    title: "This is a local notification",
                    text: 'Notification text'
                }).then(function() {
                    console.log('notification fired');
                });
            };
        });
    })
    .controller('NetworkCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaNetwork) {
        $ionicPlatform.ready(function() {
            $scope.type = $cordovaNetwork.getNetwork()
            $scope.isOnline = $cordovaNetwork.isOnline()
            $scope.isOffline = $cordovaNetwork.isOffline()
            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                console.log('The device has come online!', networkState);
                // Sync local data to your server here
            });
            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                console.log('The device has gone offline!', networkState);
                // the device is offline, we need to store the data locally
            });
        });
    })
    .controller('PinCtrl', function($ionicPlatform, $scope, $cordovaPinDialog, $ionicLoading) {
        $ionicPlatform.ready(function() {
            var txt;
            $cordovaPinDialog.prompt('Enter your PIN').then(
                function(result) {
                    // result
                    if (result.buttonIndex === 1) {
                        // clicked OK
                        txt = 'You have entered ' + result.input1;
                        showDialog(txt);
                        $scope.pin = txt;
                    } else {
                        // clicked Cancel
                        txt = 'You cancelled the Pin Dialog :/'
                        showDialog(txt);
                        $scope.pin = txt;
                    }
                },
                function(error) {
                    // error
                    console.log(error);
                });

            function showDialog(text) {
                $ionicLoading.show({
                    template: text
                });
                setTimeout(function() {
                    $ionicLoading.hide();
                }, 2000);
            }
        });
    })
    .controller('ShareCtrl', function($ionicPlatform, $scope, $cordovaSocialSharing) {
        $ionicPlatform.ready(function() {
            var message = 'This is a demo message';
            var subject = 'This is a demo message';
            var link = 'http://somerandom.link/image.png'; // fake image
            $scope.nativeShare = function() {
                $cordovaSocialSharing
                    .share(message, subject, link); // Share via native share sheet
            };
            //checkout http://ngcordova.com/docs/plugins/socialSharing/
            // for other sharing options
        });
    })

.controller('SqliteCtrl', function($ionicPlatform, $scope, $cordovaSQLite, $sce) {
    $ionicPlatform.ready(function() {
        $scope.messages = '';
        var db = $cordovaSQLite.openDB({
            name: "demo.db"
        });
        $scope.messages = '';
        $scope.showMessage = function(msg) {
            $scope.messages += $sce.trustAsHtml('> ' + msg);
        }
        $scope.showMessage('<b>Opened new DB</b><br/>');
        db.transaction(function(tx) {
            // Drop demo_table if it exists 
            tx.executeSql('DROP TABLE IF EXISTS demo_table');
            $scope.showMessage('<b>Dropped exsiting demo_table</b><br/>');
            // create table 
            tx.executeSql('CREATE TABLE IF NOT EXISTS demo_table (id integer primary key, data text, data_num integer)');
            $scope.showMessage('<b>Created demo_table</b><br/>');
            $scope.showMessage('<b>Inserting Sample Data</b><br/>');
            // insert sample data
            tx.executeSql("INSERT INTO demo_table (data, data_num) VALUES (?,?)", ["demo", 100], function(tx, res) {
                $scope.showMessage('&nbsp;&nbsp;&nbsp;insertId: ' + res.insertId + '<br/>');
                $scope.showMessage('&nbsp;&nbsp;&nbsp;rowsAffected: ' + res.rowsAffected + '<br/>');
            });
        });
    });
})

.controller('ToastCtrl', function($ionicPlatform, $scope, $cordovaToast) {
    $ionicPlatform.ready(function() {
        $cordovaToast.showShortTop('Hello World!!');
        $scope.showToast = function() {
            $cordovaToast
                .show('You clicked a button!!', 'long', 'center');
        }
    });
})

.controller('VibrateCtrl', function($ionicPlatform, $scope, $cordovaVibration, $timeout) {
    $ionicPlatform.ready(function() {
        $scope.vibrateDevice = function() {
            // A vibration pattern
            $cordovaVibration.vibrate(100);
            $timeout(function() {
                $cordovaVibration.vibrate(100);
                $timeout(function() {
                    $cordovaVibration.vibrate(100);
                }, 300);
            }, 300);
        }
    });
})

.controller('ChartsCtrl', ['$scope', function ($scope) {
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  $scope.donut={};

  $scope.donut.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.donut.data = [300, 500, 100];

}])

.controller('PrintCtrl', ['$scope', '$cordovaPrinter', function ($scope, $cordovaPrinter) {
   
  var printerAvail = $cordovaPrinter.isAvailable();
  var doc = "<html> <body>kjfhdkjfhfdksjhflkf</body> </html>";



  $scope.print=function () {

  $cordovaPrinter.print(doc);
      
  };
}]);


// .controller('GeoCtrl', function($cordovaGeolocation, $scope) {

//   var posOptions = {timeout: 10000, enableHighAccuracy: false};
//   $cordovaGeolocation
//     .getCurrentPosition(posOptions)
//     .then(function (position) {
//       $scope.lat  = position.coords.latitude;
//       $scope.long = position.coords.longitude;
//     }, function(err) {
//       // error
//     });
//   var watchOptions = {
//     frequency : 1000,
//     timeout : 3000,
//     enableHighAccuracy: false // may cause errors if true
//   };
//   var watch = $cordovaGeolocation.watchPosition(watchOptions);
//   watch.then(
//     null,
//     function(err) {
//       // error
//     },
//     function(position) {
//       var lat  = position.coords.latitude;
//       var long = position.coords.longitude;
//   });


// })



