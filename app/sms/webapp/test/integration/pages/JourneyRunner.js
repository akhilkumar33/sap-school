sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sms/test/integration/pages/DepartmentList",
	"sms/test/integration/pages/DepartmentObjectPage",
	"sms/test/integration/pages/TeachersObjectPage"
], function (JourneyRunner, DepartmentList, DepartmentObjectPage, TeachersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sms') + '/test/flp.html#app-preview',
        pages: {
			onTheDepartmentList: DepartmentList,
			onTheDepartmentObjectPage: DepartmentObjectPage,
			onTheTeachersObjectPage: TeachersObjectPage
        },
        async: true
    });

    return runner;
});

