/*
 * Brand splitter
 */
var brand = document.querySelector('.brand')
var text = brand.innerHTML
text = '<span>' + text.trim().split('').join('</span><span>') + '</span>'
brand.innerHTML = text
