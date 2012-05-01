/*!
 * jquery.pinterest.js - placing your images with Pinterest look
 *
 * @version  1.0.0
 * @author   yusugomori
 * @license  http://yusugomori.com/license/mit The MIT License
 *
 * More details on github: https://github.com/yusugomori/jQueryPinterest
*/
var jQueryPinterest;

jQueryPinterest = (function() {

  function jQueryPinterest(options) {
    var _this = this;
    if (options == null) options = {};
    this.pinHolderId = '#jQueryPinHolder';
    this.pinHolderWidth = 940;
    this.pinHolderToggle = true;
    this.pinWidth = 192;
    this.pinPadding = 15;
    this.pinMargin = 15;
    if (options.pinHolderId != null) this.pinHolderId = options.pinHolderId;
    if (options.pinHolderWidth != null) {
      this.pinHolderWidth = options.pinHolderWidth;
    }
    if (options.pinHolderToggle != null) {
      this.pinHolderToggle = options.pinHolderToggle;
    }
    if (options.pinWidth != null) this.pinWidth = options.pinWidth;
    if (options.pinPadding != null) this.pinPadding = options.pinPadding;
    if (options.pinMargin != null) this.pinMargin = options.pinMargin;
    this.pins = "" + this.pinHolderId + " .pin";
    $(this.pinHolderId).css({
      visibility: 'hidden',
      position: 'relative',
      'margin-left': 'auto',
      'margin-right': 'auto',
      'min-width': this.pinHolderWidth
    });
    $(this.pins).css({
      position: 'absolute',
      width: this.pinWidth,
      padding: this.pinPadding,
      background: '#fff',
      '-webkit-box-shadow': '0 1px 3px rgba(34,25,25,0.4)',
      '-moz-box-shadow': '0 1px 2px rgba(34,25,25,0.4)',
      'box-shadow': '0 1px 3px rgba(34,25,25,0.4)'
    });
    $('body').imagesLoaded(function() {
      return _this.main();
    });
    $(window).bind("resize", function() {
      return _this.main();
    });
  }

  jQueryPinterest.prototype.main = function() {
    var globalHeight, i, localHeight, localPins, n, rowNum, self;
    this.clientWidth = this.getClientWidth();
    this.pinNum = this.getPinNum();
    rowNum = this.getRowNum();
    globalHeight = new Array(rowNum);
    for (i = 0; 0 <= rowNum ? i < rowNum : i > rowNum; 0 <= rowNum ? i++ : i--) {
      globalHeight[i] = 0;
    }
    localHeight = [];
    localPins = [];
    self = this;
    n = 0;
    $(this.pins).each(function() {
      var obj, r;
      r = n % rowNum;
      if (r === 0) {
        localHeight = [];
        localPins = [];
      }
      self.storePinData(this, localHeight, localPins);
      n++;
      if ((r === rowNum - 1) || (n === self.pinNum && r !== rowNum - 1)) {
        if (n !== rowNum) {
          obj = self.sortPins(globalHeight, localHeight);
        } else {
          obj = self._sortPins(globalHeight, localHeight);
        }
        return self.setPins(globalHeight, localHeight, localPins, obj);
      }
    });
    return $(this.pinHolderId).css({
      visibility: 'visible',
      width: rowNum * (this.pinWidth + 2 * this.pinPadding) + (rowNum - 1) * this.pinMargin,
      height: Math.max.apply(null, globalHeight)
    });
  };

  jQueryPinterest.prototype.storePinData = function(el, localHeight, localPins) {
    var img, imgHeight, _imgWidth;
    img = $(el).find('img');
    if (img.length > 1) img = img[0];
    _imgWidth = $(img).width();
    imgHeight = $(img).height() * this.pinWidth / _imgWidth;
    $(img).css({
      width: this.pinWidth,
      height: Math.floor(imgHeight),
      display: 'block'
    });
    localHeight.push($(el).outerHeight());
    localPins.push(el);
    return this;
  };

  jQueryPinterest.prototype.setPins = function(globalHeight, _localHeight, _localPins, obj) {
    var asortO, i, localHeight, localPins, sortO, _ref;
    localPins = _localPins.concat();
    localHeight = _localHeight.concat();
    for (i = 0, _ref = localHeight.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      sortO = obj.sortedLocalHeightOrder[i];
      asortO = obj.asortedGlobalHeightOrder[i];
      $(localPins[sortO]).css({
        top: globalHeight[asortO] + this.pinMargin,
        left: asortO * (this.pinWidth + 2 * this.pinPadding + this.pinMargin)
      });
      globalHeight[asortO] += localHeight[sortO] + this.pinMargin;
    }
    return this;
  };

  jQueryPinterest.prototype._sortPins = function(globalHeight, _localHeight) {
    var asortedGlobalHeightOrder, i, localHeight, sortedLocalHeightOrder, _ref, _ref2;
    localHeight = _localHeight.concat();
    sortedLocalHeightOrder = new Array(localHeight.length);
    asortedGlobalHeightOrder = new Array(globalHeight.length);
    for (i = 0, _ref = localHeight.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      sortedLocalHeightOrder[i] = i;
    }
    for (i = 0, _ref2 = globalHeight.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      asortedGlobalHeightOrder[i] = i;
    }
    return {
      sortedLocalHeightOrder: sortedLocalHeightOrder,
      asortedGlobalHeightOrder: asortedGlobalHeightOrder
    };
  };

  jQueryPinterest.prototype.sortPins = function(globalHeight, _localHeight) {
    var asortedGlobalHeight, asortedGlobalHeightOrder, i, j, localHeight, sortedLocalHeight, sortedLocalHeightOrder, _ref, _ref2, _ref3, _ref4;
    localHeight = _localHeight.concat();
    sortedLocalHeight = localHeight.concat().sort(this.arraySort);
    asortedGlobalHeight = globalHeight.concat().sort(this.arraySort).reverse();
    sortedLocalHeightOrder = new Array(localHeight.length);
    asortedGlobalHeightOrder = new Array(globalHeight.length);
    for (i = 0, _ref = localHeight.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      for (j = 0, _ref2 = localHeight.length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
        if (sortedLocalHeight[i] === localHeight[j] && sortedLocalHeightOrder.indexOf(j) === -1) {
          sortedLocalHeightOrder[i] = j;
          break;
        }
      }
    }
    for (i = 0, _ref3 = globalHeight.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      for (j = 0, _ref4 = globalHeight.length; 0 <= _ref4 ? j < _ref4 : j > _ref4; 0 <= _ref4 ? j++ : j--) {
        if (asortedGlobalHeight[i] === globalHeight[j] && asortedGlobalHeightOrder.indexOf(j) === -1) {
          asortedGlobalHeightOrder[i] = j;
          break;
        }
      }
    }
    return {
      sortedLocalHeightOrder: sortedLocalHeightOrder,
      asortedGlobalHeightOrder: asortedGlobalHeightOrder
    };
  };

  jQueryPinterest.prototype.getClientWidth = function() {
    var clientWidth;
    if (this.pinHolderToggle === true) {
      clientWidth = document.documentElement.clientWidth;
      if (!(clientWidth > this.pinHolderWidth)) clientWidth = this.pinHolderWidth;
    } else {
      clientWidth = this.pinHolderWidth;
    }
    return clientWidth;
  };

  jQueryPinterest.prototype.getRowNum = function() {
    var clientWidth, pinMargin, pinOuterWidth, r;
    r = 0;
    clientWidth = this.clientWidth;
    pinOuterWidth = this.pinWidth + 2 * this.pinPadding;
    pinMargin = this.pinMargin;
    while (clientWidth >= pinOuterWidth) {
      clientWidth -= pinOuterWidth;
      r++;
      if (clientWidth >= pinMargin) clientWidth -= pinMargin;
    }
    return r;
  };

  jQueryPinterest.prototype.getPinNum = function() {
    var r;
    r = 0;
    $(this.pins).each(function() {
      return r++;
    });
    return r;
  };

  jQueryPinterest.prototype.arraySort = function(a, b) {
    return b - a;
  };

  return jQueryPinterest;

})();
