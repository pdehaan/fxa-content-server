/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

define([
  'underscore',
  'views/base',
  'stache!templates/complete_sign_up',
  'lib/session',
  'lib/fxa-client',
  'lib/url',
  'lib/xss'
],
function (_, BaseView, CompleteSignUpTemplate, Session, FxaClient, Url, Xss) {
  var t = BaseView.t;

  var CompleteSignUpView = BaseView.extend({
    template: CompleteSignUpTemplate,
    className: 'complete_sign_up',

    context: function () {
      return {
        email: Session.email,
        service: Url.searchParam('service'),
        redirectTo: Xss.href(Url.searchParam('redirectTo'))
      };
    },

    afterRender: function () {
      var uid = Url.searchParam('uid');
      if (! uid) {
        return this.displayError(t('no uid specified'));
      }

      var code = Url.searchParam('code');
      if (! code) {
        return this.displayError(t('no code specified'));
      }

      var client = new FxaClient();
      client.verifyCode(uid, code)
            .then(function () {
              // TODO - we could go to a "sign_up_complete" screen here.
              this.$('#fxa-complete-sign-up-success').show();

              this.$('h2.success').show();
              this.$('h2.failure').hide();
            }.bind(this), function (err) {
              this.displayError(err.errno || err.message);

              this.$('h2.success').hide();
              this.$('h2.failure').show();
            }.bind(this));
    }

  });

  return CompleteSignUpView;
});
