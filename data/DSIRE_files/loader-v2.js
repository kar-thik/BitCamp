(function() {

    var __hs_cta_json = {"css":"a#cta_button_479905_f8ccc64f-8ead-4828-bb3d-8aeff1490f02 {\n  -webkit-font-smoothing:antialiased; \n  cursor:pointer; \n  -moz-user-select:none; \n  -webkit-user-select:none; \n  -o-user-select:none; \n  user-select:none; \n  display:inline-block; \n  font-weight:normal; \n  text-align:center; \n  text-decoration:none; \n  font-family:sans-serif; \n  background:rgb(204,0,0); \n  color:rgb(255, 255, 255); \n  border-radius:6px; \n  border-width:0px; \n  transition:all .4s ease; \n  -moz-transition:all .4s ease; \n  -webkit-transition:all .4s ease; \n  -o-transition:all .4s ease; \n  text-shadow:none; \n  line-height:1.5em; \n  padding:6px 17px; \n@import url('https://fonts.googleapis.com/css?family=Open+Sans');\n\nborder-radius: 0;\nfont-family: 'Open Sans', sans-serif;}\na#cta_button_479905_f8ccc64f-8ead-4828-bb3d-8aeff1490f02:hover {\nbackground:rgb(224,0,0); \ncolor:rgb(255,255,255); \n}\na#cta_button_479905_f8ccc64f-8ead-4828-bb3d-8aeff1490f02:active, #cta_button_479905_f8ccc64f-8ead-4828-bb3d-8aeff1490f02:active:hover {\nbackground:rgb(163,0,0); \ncolor:rgb(244,244,244); \n}\n\n","image_html":"<a id=\"cta_button_479905_f8ccc64f-8ead-4828-bb3d-8aeff1490f02\" class=\"cta_button\" href=\"https://cta-service-cms2.hubspot.com/ctas/v2/public/cs/c/?cta_guid=f8ccc64f-8ead-4828-bb3d-8aeff1490f02&placement_guid=24f6de41-f4cb-4d54-bd03-4e93c4803dc6&portal_id=479905&redirect_url=APefjpH-PCYRfFOiRykgh8esV8MOSKcwEXhBCnsy6jhsOM1yf1nHfYUhFOqaH5-Tw2ZjGLB56rBmOW5SEEeU5j7lX8NwA0pkCLO23nLXwHVMyRbf3_LPh6qUUaOFuQQDVfL3k0d7Wz6A1WR3RDyYV2Vdu7OvbDEf3A&hsutk=c7a000001eaf10221b8a01629fe7122b&canon=http%3A%2F%2Fprograms.dsireusa.org%2Fsystem%2Fprogram&click=c148806f-422f-4898-83fd-e5f6c024e0a9\"  target=\"_blank\"  cta_dest_link=\"https://www.energysage.com/solar/calculator/?rc=dsirecalc\"><img id=\"hs-cta-img-24f6de41-f4cb-4d54-bd03-4e93c4803dc6\" class=\"hs-cta-img \" style=\"border-width: 0px; /*hs-extra-styles*/\" mce_noresize=\"1\" alt=\"Try Solar Calculator\" src=\"http://cdn2.hubspot.net/hubshot/17/09/26/c56d020d-71ad-4f2a-bb91-b67f41889a99.png\" /></a>","is_image":false,"placement_element_class":"hs-cta-24f6de41-f4cb-4d54-bd03-4e93c4803dc6","raw_html":"<a id=\"cta_button_479905_f8ccc64f-8ead-4828-bb3d-8aeff1490f02\" class=\"cta_button \" href=\"https://cta-service-cms2.hubspot.com/ctas/v2/public/cs/c/?cta_guid=f8ccc64f-8ead-4828-bb3d-8aeff1490f02&placement_guid=24f6de41-f4cb-4d54-bd03-4e93c4803dc6&portal_id=479905&redirect_url=APefjpH-PCYRfFOiRykgh8esV8MOSKcwEXhBCnsy6jhsOM1yf1nHfYUhFOqaH5-Tw2ZjGLB56rBmOW5SEEeU5j7lX8NwA0pkCLO23nLXwHVMyRbf3_LPh6qUUaOFuQQDVfL3k0d7Wz6A1WR3RDyYV2Vdu7OvbDEf3A&hsutk=c7a000001eaf10221b8a01629fe7122b&canon=http%3A%2F%2Fprograms.dsireusa.org%2Fsystem%2Fprogram&click=c148806f-422f-4898-83fd-e5f6c024e0a9\" target=\"_blank\" style=\"/*hs-extra-styles*/\" cta_dest_link=\"https://www.energysage.com/solar/calculator/?rc=dsirecalc\" title=\"Try Solar Calculator\">Try Solar Calculator</a>"};
    var __hs_cta = {};

    __hs_cta.drop = function() {
        var is_legacy = document.getElementById('hs-cta-ie-element') && true || false,
            html = __hs_cta_json.image_html,
            tags = __hs_cta.getTags(),
            is_image = __hs_cta_json.is_image,
            parent, _style;

        if (!is_legacy && !is_image) {
            parent = (document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]);

            _style = document.createElement('style');
            parent.insertBefore(_style, parent.childNodes[0]);
            try {
                default_css = ".hs-cta-wrapper p, .hs-cta-wrapper div { margin: 0; padding: 0; }";
                cta_css = default_css + " " + __hs_cta_json.css;
                // http://blog.coderlab.us/2005/09/22/using-the-innertext-property-with-firefox/
                _style[document.all ? 'innerText' : 'textContent'] = cta_css;
            } catch (e) {
                // addressing an ie9 issue
                _style.styleSheet.cssText = cta_css;
            }

            html = __hs_cta_json.raw_html;
        }

        for (var i = 0; i < tags.length; ++i) {

            var tag = tags[i];
            var images = tag.getElementsByTagName('img');
            var cssText = "";
            var align = "";
            for (var j = 0; j < images.length; j++) {
                align = images[j].align;
                images[j].style.border = '';
                images[j].style.display = '';
                cssText = images[j].style.cssText;
            }

            if (align == "right") {
                tag.style.display = "block";
                tag.style.textAlign = "right";
            } else if (align == "middle") {
                tag.style.display = "block";
                tag.style.textAlign = "center";
            }

            tag.innerHTML = html.replace('/*hs-extra-styles*/', cssText);
            tag.style.visibility = 'visible';
            tag.setAttribute('data-hs-drop', 'true');
            window.hbspt && hbspt.cta && hbspt.cta.afterLoad && hbspt.cta.afterLoad('24f6de41-f4cb-4d54-bd03-4e93c4803dc6');
        }

        return tags;
    };

    __hs_cta.getTags = function() {
        var allTags, check, i, divTags, spanTags,
            tags = [];
            if (document.getElementsByClassName) {
                allTags = document.getElementsByClassName(__hs_cta_json.placement_element_class);
                check = function(ele) {
                    return (ele.nodeName == 'DIV' || ele.nodeName == 'SPAN') && (!ele.getAttribute('data-hs-drop'));
                };
            } else {
                allTags = [];
                divTags = document.getElementsByTagName("div");
                spanTags = document.getElementsByTagName("span");
                for (i = 0; i < spanTags.length; i++) {
                    allTags.push(spanTags[i]);
                }
                for (i = 0; i < divTags.length; i++) {
                    allTags.push(divTags[i]);
                }

                check = function(ele) {
                    return (ele.className.indexOf(__hs_cta_json.placement_element_class) > -1) && (!ele.getAttribute('data-hs-drop'));
                };
            }
            for (i = 0; i < allTags.length; ++i) {
                if (check(allTags[i])) {
                    tags.push(allTags[i]);
                }
            }
        return tags;
    };

    // need to do a slight timeout so IE has time to react
    setTimeout(__hs_cta.drop, 10);
    window._hsq = window._hsq || [];
    window._hsq.push(['trackCtaView', '24f6de41-f4cb-4d54-bd03-4e93c4803dc6', 'f8ccc64f-8ead-4828-bb3d-8aeff1490f02']);
}());
