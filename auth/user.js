"use strict";

function User(data) {
    data = data || {};
    _.extend(this, data);

    if (!this.current_institution) {
        this.changeInstitution();
    }
}

var SENT = "sent";

var USER = "USER";

User.prototype.changeInstitution = function changeInstitution(institution) {
    if (this.institutions && this.institutions.length > 0) {
        institution = institution || this.institutions[0];
        this.current_institution = _.find(this.institutions, {'key': institution.key});
        changeProfileColor(this, institution);
        window.localStorage.userInfo = JSON.stringify(this);
    }
};

User.prototype.follow = function follow(institution) {
    this.follows.push(institution);
};

User.prototype.unfollow = function unfollow(institution) {
    _.remove(this.follows, function(followingInst){
        return followingInst.key == institution.key;
    });
};

User.prototype.isFollower = function isFollower(institution) {
    var isFollower = false;
    _.forEach(this.follows, function(followingInst) {
        if(followingInst.key == institution.key){
            isFollower = true;
        }
    });
    return isFollower;
};

User.prototype.isAdmin = function isAdmin(keyInstitution) {
    var managed_institution = _.find(this.institutions_admin, function(institution) {
    return getKey(institution) == keyInstitution; });
    return managed_institution;
};

User.prototype.isMember = function isMember(institutionKey){
    return _.includes(_.map(this.institutions, getKeyObj), institutionKey);
};

User.prototype.addInstitution = function addInstitution(institution) {
    this.institutions.push(institution);
};


User.prototype.isValid = function isValid() {
    if (_.isUndefined(this.name) || _.isEmpty(this.name)) {
        return false;
    }

    if (_.isUndefined(this.email) || _.isEmpty(this.email)) {
        return false;
    }

    var cpfNotNull = this.cpf !== null;
    if (cpfNotNull && (_.isUndefined(this.cpf) || _.isEmpty(this.cpf))) {
        return false;
    }
    return true;
};

User.prototype.getPendingInvitation = function getPendingInvitation(){
    return _.find(this.invites, {'status': SENT});
};

User.prototype.removeInvite = function removeInvite(inviteKey) {
    _.remove(this.invites, function(invite){
        return inviteKey == invite.key;
    });
};

User.prototype.removeInstitution = function removeInstitution(institutionKey, removeHierarchy) {
    var toRemove = function toRemove(institution) {
        var childToRemove = (institution.parent_institution &&
                institution.parent_institution === institutionKey &&
                removeHierarchy);
        return (institution.key === institutionKey) || childToRemove;
    };

    _.remove(this.institutions, toRemove);
    _.remove(this.follows, toRemove);

    if(!_.isEmpty(this.institutions)) {
        this.changeInstitution();
    }
};

User.prototype.removeProfile = function removeProfile(institutionKey, removeHierarchy) {
    var user = this;
    var toRemove = function toRemove(profile) {
        // This is necessary because the profile doesn't have the information about hierarchy.
        var childToRemove = _.find(user.institutions, function(institution) {
            return (institution.key === profile.institution_key &&
                institution.parent_institution === institutionKey);
        });
        return (profile.institution_key === institutionKey) || (childToRemove && removeHierarchy);
    };
    _.remove(this.institution_profiles, toRemove);
};

User.prototype.updateInstitutions = function updateInstitutions(institution){
    updateInstitution(this.institutions, institution);
    updateFollowInstitution(this.follows, institution);
};

User.prototype.addProfile = function addProfile(profile){
    this.institution_profiles.push(profile);
};

User.prototype.isInactive = function isInactive() {
    var notActive = this.state != 'active';
    return notActive;
};

User.prototype.hasPermission = function hasPermission(permissionType, entityKey) {
    var key = entityKey || this.current_institution.key;
    if (this.permissions[permissionType]) {
        return this.permissions[permissionType][key];
    }
    return false;
};

function changeProfileColor(user, institution) {
    var profile = _.find(user.institution_profiles, {
        'institution_key': institution.key
    });
    const color = profile ? profile.color : 'grey';
    user.current_institution.color = color;
}

function updateFollowInstitution(follows, institution) {
    var index = _.findIndex(follows, ['key', institution.key]);
    follows[index].acronym = institution.acronym;
    follows[index].photo_url = institution.photo_url;
}

function updateInstitution(institutions, institution) {
    var index = _.findIndex(institutions, ['key', institution.key]);
    institutions[index] = institution;
}

function getKeyObj(obj) {
    if(obj.key){
    return obj.key;
    }
}

function getKey(obj){
    var key = obj.split("/");
    key = key[key.length -1];

    return key;
}