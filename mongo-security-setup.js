/* insertData: insert dummy data for hospital security example */

var insertData = function() {
  db = db.getSiblingDB('MongoGeneral');
  for (var i = 0; i < 100; i++) {
    sick = false;
    if (i % 2 === 0) {
      sick = true;
  };
  db.patients.insert({_id: "patient(" + i + ")", sick: sick, date: new Date(), doctor: 'drj'});
  }
  
  db = db.getSiblingDB('MongoGeneral');
  for (var i = 0; i < 100; i++) {
    sick = false;
    if (i % 2 === 0) {
      sick = true;
  }
  db.foo.insert({_id: "patient(" + i + ")", sick: sick, date: new Date(), doctor: 'drj'});
  }
}

/* createFirstUser: when auth is enabled we need to create an admin user that can be used to grant further access */

var createFirstUser = function() {
	db = db.getSiblingDB('admin');
	var admin = {
		user: 'admin',
		pwd: 'admin',
		roles: [
		  'userAdminAnyDatabase',
		  'readWriteAnyDatabase',
		  'root',
		  'dbAdminAnyDatabase'
		]
	};
	db.createUser(admin);
}

/* createRoles: create roles with various privileges */

var createRoles = function() {
	db = db.getSiblingDB("MongoGeneral");
	
	var physician = {
		role: "MongoGeneral.Physician",
		privileges: [
		  { 
		    resource: {db: db.getName(), collection: ''},
		    actions: ['find', 'listCollections']
		  },
		  {
		    resource: {db: db.getName(), collection: 'patients'},
		    actions: ['insert', 'update']
		  }
		  ],
		roles: []
	};
	
	var billing = {
		role: "MongoGeneral.Billing.Associate",
		privileges : [
		{
			resource: {db: db.getName(), collection: ''},
			actions: ['find', 'listCollections']
		}
		],
		roles: []
	};
	
	var pAdmin = {
		role: "MongoGeneral.PatientSystem.Admin",
		privileges: [
		{
			resource: {db: db.getName(), collection: ''},
			actions: ['find', 'dropCollection', 'dropIndex', 'createIndex', 'listIndexes', 'listCollections']
		}
		],
		roles: []
	};

db.createRole(physician);
db.createRole(billing);
db.createRole(pAdmin);

print("Successfully created roles");

};

/* createUsers: create one user for each of the example roles */

var createUsers = function () {
	db = db.getSiblingDB('MongoGeneral');
	
	var doc1 = {
		user: 'drj',
		pwd: '76ers!',
		roles: ['MongoGeneral.Physician']
	};
	
	var biller1 = {
		user: 'johndoe',
		pwd: 'bigbucks',
		roles: ['MongoGeneral.Billing.Associate']
	};
	
	var sysAdmin = {
		user: 'sysadmin',
		pwd: 'mg_sys',
		roles: ['MongoGeneral.PatientSystem.Admin']
	};
	
	db.createUser(doc1);
	db.createUser(biller1);
	db.createUser(sysAdmin);
	
	db = db.getSiblingDB('admin');
	db.system.users.find({'roles.role': /^MongoGeneral/}).pretty();
}
