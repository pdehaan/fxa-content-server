/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

define([
  'underscore',
  'views/base',
  'stache!templates/complete_reset_password',
  'lib/fxa-client',
  'lib/session',
  'lib/url',
  'lib/password-mixin'
],
function (_, BaseView, Template, FxaClient, Session, Url, PasswordMixin) {
  var t = BaseView.t;

  var View = BaseView.extend({
    template: Template,
    className: 'complete_reset_password',

    events: {
      'submit form': 'submit',
      'keyup input': 'enableButtonWhenValid',
      'change input': 'enableButtonWhenValid',
      'change .show-password': 'onPasswordVisibilityChange'
    },

    context: function () {
      return {
        isSync: Url.searchParam('service') === 'sync'
      };
    },

    afterRender: function () {
      this.token = Url.searchParam('token');
      if (! this.token) {
        return this.displayError(t('no token specified'));
      }

      this.code = Url.searchParam('code');
      if (! this.code) {
        return this.displayError(t('no code specified'));
      }

      this.email = Url.searchParam('email');
      if (! this.email) {
        return this.displayError(t('no email specified'));
      }
    },

    submit: function (event) {
      event.preventDefault();

      if (! (this.token &&
             this.code &&
             this.email &&
             this._validatePasswords())) {
        return;
      }

      var password = this._getPassword();

      var client = new FxaClient();
      client.completePasswordReset(this.email, password, this.token, this.code)
            .done(_.bind(this._onResetCompleteSuccess, this),
                  _.bind(this._onResetCompleteFailure, this));
    },

    _onResetCompleteSuccess: function () {
      // This information will be displayed on the
      // reset_password_complete screen.
      Session.set({
        service: Url.searchParam('service'),
        redirectTo: Url.searchParam('redirectTo')
      });
      this.navigate('reset_password_complete');
    },

    _onResetCompleteFailure: function (err) {
      this.displayError(err.errno || err.message);
    },

    isValid: function () {
      return this.isElementValid('#password') &&
             this.isElementValid('#vpassword');
    },

    _validatePasswords: function () {
      if (! this.isValid()) {
        return false;
      }

      if (this._getPassword() !== this._getVPassword()) {
        this.displayError(t('passwords do not match'));
        return false;
      }

      return true;
    },

    _getPassword: function () {
      return this.$('#password').val();
    },

    _getVPassword: function () {
      return this.$('#vpassword').val();
    }
  });

  _.extend(View.prototype, PasswordMixin);

  return View;
});
