/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';


define([
  'mocha',
  'chai',
  'underscore',
  'jquery',
  'views/sign_up',
  '../../mocks/router'
],
function (mocha, chai, _, $, View, RouterMock) {
  /*global describe, beforeEach, afterEach, it*/
  var assert = chai.assert;

  describe('views/sign_up', function () {
    var view, router, email;

    beforeEach(function () {
      email = 'testuser.' + Math.random() + '@testuser.com';
      document.cookie = 'tooyoung=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      sessionStorage.removeItem('tooYoung');
      router = new RouterMock();
      view = new View({
        router: router
      });
      view.render();

      $('#container').append(view.el);
    });

    afterEach(function () {
      view.remove();
      view.destroy();
      view = null;
      router = null;
      document.cookie = 'tooyoung=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
    });

    describe('isValid', function () {
      it('returns true if email, password, and age are all valid', function () {
        $('.email').val(email);
        $('.password').val('password');
        $('#fxa-age-year').val('1960');

        assert.isTrue(view.isValid());
      });

      it('returns false if email is empty', function () {
        $('.password').val('password');
        $('#fxa-age-year').val('1960');

        assert.isFalse(view.isValid());
      });

      it('returns false if email is not an email address', function () {
        $('.email').val('testuser');
        $('.password').val('password');
        $('#fxa-age-year').val('1960');

        assert.isFalse(view.isValid());
      });

      it('returns false if password is empty', function () {
        $('.email').val(email);
        $('#fxa-age-year').val('1960');

        assert.isFalse(view.isValid());
      });

      it('returns false if password is invalid', function () {
        $('.email').val(email);
        $('.password').val('passwor');
        $('#fxa-age-year').val('1960');

        assert.isFalse(view.isValid());
      });

      it('returns false if age is invalid', function () {
        $('.email').val(email);
        $('.password').val('password');

        assert.isFalse(view.isValid());
      });
    });

    describe('signUp', function () {
      it('sends the user to confirm screen if form filled out, >= 14 years ago', function (done) {
        $('.email').val(email);
        $('.password').val('password');

        var nowYear = (new Date()).getFullYear();
        $('#fxa-age-year').val(nowYear - 14);

        router.on('navigate', function () {
          assert.equal(router.page, 'confirm');
          done();
        });
        view.signUp();
      });

      it('sends the user to cannot_create_account screen if user selects <= 13 years ago', function (done) {
        $('.email').val(email);
        $('.password').val('password');

        var nowYear = (new Date()).getFullYear();
        $('#fxa-age-year').val(nowYear - 13);

        router.on('navigate', function () {
          assert.equal(router.page, 'cannot_create_account');
          done();
        });
        view.signUp();
      });

      it('sends user to cannot_create_account when visiting sign up if they have already been sent there', function (done) {
        $('.email').val(email);
        $('.password').val('password');

        var nowYear = (new Date()).getFullYear();
        $('#fxa-age-year').val(nowYear - 13);

        view.signUp();
        assert.equal(router.page, 'cannot_create_account');

        // simulate user re-visiting the /signup page after being rejected
        var revisitRouter = new RouterMock();

        revisitRouter.on('navigate', function () {
          assert.equal(revisitRouter.page, 'cannot_create_account');
          done();
        });

        var revisitView = new View({
          router: revisitRouter
        });
        revisitView.render();
      });
    });

    describe('updatePasswordVisibility', function () {
      it('pw field set to text when clicked', function () {
        $('.show-password').click();
        assert.equal($('.password').attr('type'), 'text');
      });

      it('pw field set to password when clicked again', function () {
        $('.show-password').click();
        $('.show-password').click();
        assert.equal($('.password').attr('type'), 'password');
      });
    });
  });
});


