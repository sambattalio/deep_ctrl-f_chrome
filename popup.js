let search = document.getElementById('searchPage');

search.onclick = function(element) {
    var text = document.getElementById('searchParam').value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id,
            { code: `var arr = [], links = document.links; for (var i = 0; i < links.length; i++){arr.push(links[i].href);} arr;` },
            function (test){ 
                arr = test[0];
                var lastTag = document.getElementById('charCount');
                let chars   = lastTag.value;
                console.log(chars);
                for (var i = 0; i < arr.length; i++) {
                    (function(arr, i){
                        let xhr = new XMLHttpRequest();
                        xhr.open("GET", arr[i], true);
                        xhr.onload = function(e) {
                            let url = arr[i]; 
                            console.log
                            findMatches(xhr.responseText, url, text, lastTag, parseInt(chars));
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


function findMatches(content, url, searchTerm, lastTag, chars){
    content = content.replace(/(<([^>]+)>)/ig,"");
    var n = content.search(searchTerm);

    var indices = getIndicesOf(searchTerm, content, false);
    if (indices.length == 0) return;
    // create base url
    var div = document.createElement('div');
    div.setAttribute('class', 'matched');

    var a = document.createElement('a');
    a.setAttribute('href', url);
    a.innerHTML = url;
    div.appendChild(a);
    checkCloseIndices(indices, chars);
    console.log(indices);
    // Grab strings
    for (n in indices) {
        let para = document.createElement('p');
        para.innerHTML = '\n' + content.substring(indices[n] - chars, indices[n] + chars) + '\n';
        div.appendChild(para);
    } 
    lastTag.parentNode.insertBefore(div, lastTag.nextSibling);
    lastTag = div;
}

// combines indices if too close to eachother
function checkCloseIndices(indices, chars) {
    var last_i = indices.length - 1;
    var i = indices.length - 1;
    while (i--) {
        if (indices[last_i] - indices[i] < chars * 2) {
            indices.splice(i, 1);
            continue;
        }
        last_i = i;
    }
}

// Thanks stack overflow!
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}