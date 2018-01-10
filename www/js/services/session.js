angular.module('mean').service('session', [function () {
	'use strict';
	this.create = function (account) {
		this.userId = account.userId;
		this.timestamp = account.timestamp;
		this.lastUpdated = account.lastUpdated;
		this.firstName = account.firstName;
		this.lastName = account.lastName;
		this.email = account.email;
		this.agreeToTermsDate = account.agreeToTermsDate;
		this.lastLoginDate = account.lastLoginDate;
		this.isActive = account.isActive;
		this.isLocked = account.isLocked;
	};
	this.destroy = function () {
		delete this.userId;
		delete this.timestamp;
		delete this.lastUpdated;
		delete this.firstName;
		delete this.lastName;
		delete this.email;
		delete this.agreeToTermsDate;
		delete this.lastLoginDate;
		delete this.isActive;
		delete this.isLocked;
	};
	return this;
}])