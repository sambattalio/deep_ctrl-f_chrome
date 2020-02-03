let search = document.getElementById('searchPage');

search.onclick = function(element) {
    var text = document.getElementById('searchParam').value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id,
            { code: `var arr = [], links = document.links; for (var i = 0; i < links.length; i++){arr.push(links[i].href);} arr;` },
            function (test){ 
                console.log(text);
                arr = test[0];
                var lastTag = search;
                for (var i = 0; i < arr.length; i++) {
                    (function(arr, i){
                        let xhr = new XMLHttpRequest();
                        xhr.open("GET", arr[i], true);
                        xhr.onload = function(e) {
                            let url = arr[i]; 
                            console.log
                            findMatches(xhr.responseText, url, text, lastTag);
                        };
                        xhr.onerror = function() {
                            console.error("Error occured with XMLHTTPRequest");
                        }
                        xhr.send();
                    })(arr, i);
                }
            })
      })
};




function httpGet(theUrl) {
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function findMatches(content, url, searchTerm, lastTag){
    console.log(content);
    content = content.replace(/(<([^>]+)>)/ig,"");
    var n = content.search(searchTerm);
    console.log(n);

    if (n != -1) {
        var div = document.createElement('div');
        div.setAttribute('class', 'matched');

        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.innerHTML = url;
        var para = document.createElement('p');
        para.innerHTML = '\n' + content.substring(n - 200, n + 200) + '\n';

        div.appendChild(a);
        div.appendChild(para);

        lastTag.parentNode.insertBefore(div, lastTag.nextSibling);
        lastTag = div;
        console.log("here");
    }
}