String.prototype.titleize = function() {
  strings = this.split(' ')
  string  = ''
  for (var i = 0, len = strings.length; i < len; ++i) {
    string += strings[i].charAt(0).toUpperCase() + strings[i].toLowerCase().slice(1)
    if (i != (len-1)) { string += ' ' }
  }
  return string
}
