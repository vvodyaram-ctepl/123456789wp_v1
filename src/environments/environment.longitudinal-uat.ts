// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    baseUrl: 'https://wp-service-longitudinal-uat-ygue7fpaba-uc.a.run.app/wearables',
    baseUrl2: '',
    gcpStoragePath: 'https://storage.googleapis.com/wearables-sensor-data-pr/UAT/GCloud/WPortal/',
    grantType: 'password',
    clientId: 'adminClientId',
    clientSecret: '$CLIENT_SECRET',
    tokenString: 'userToken',
    userId: 'userId',
    refreshTokenString: 'userRefreshToken',
    firebase: {
      apiKey: "$FIREBASE_DEV_KEY",
      authDomain: "ct-wearables-portal-pf.firebaseapp.com",
      projectId: "ct-wearables-portal-pf",
      storageBucket: "ct-wearables-portal-pf.appspot.com"
    },
  
  
    //questionnaire variables
    otherSpecifyText: 'Other, Specify',
    noneOfTheAboveText: 'None of the above',
  
    //customer service report
    customerSupportDashboardReportUrl: 'https://lookerstudio.google.com/embed/reporting/e24205e0-7e77-497b-a5f1-5997d17677a3/page/p_lyo2u07t4c',
  
    //prelude config order
    preludeMandatoryFields: ["External Patient ID", "Pet Name", "Breed", "Pet Parent Last Name", "Pet Parent Email", "Secondary Email", "Baseline Start Date", "Baseline End Date", "Treatment Start Date", "Treatment End Date", "Study Group", "Address Line 1", "City", "State", "Zipcode"]
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.