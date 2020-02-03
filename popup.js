let search = document.getElementById('searchPage');

search.onclick = function(element) {
    var text = document.getElementById('searchParam').value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id,
            { code: `var arr = [], links = document.links; for (var i = 0; i < links.length; i++){arr.push(links[i].href);} arr;` },
            function (test){ 
                console.log(text);
                arr = test[0];
                var content = null;
                var lastTag = search;
                parser = new DOMParser();
                for (var i = 0; i < arr.length; i++) {
                    // TODO Async function
                    content = httpGet(arr[i]);
                    var n = content.search(text);
                    if (n != -1) {
                        var div = document.createElement('div');
                        div.setAttribute('class', 'matched');

                        var a = document.createElement('a');
                        a.setAttribute('href', arr[i]);
                        a.innerHTML = arr[i];
                        var para = document.createElement('p');
                        para.innerHTML = '\n' + content.substring(n - 100, n + 100) + '\n';

                        div.appendChild(a);
                        div.appendChild(para);

                        lastTag.parentNode.insertBefore(div, lastTag.nextSibling);
                        lastTag = div;
                    }
                }
            })
      })
};




function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}