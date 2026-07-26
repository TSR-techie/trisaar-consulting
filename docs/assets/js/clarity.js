/**
 * ==========================================================
 * Microsoft Clarity Provider
 * TriSaar Consulting
 *
 * Responsible only for loading Microsoft Clarity.
 * ==========================================================
 */

const MicrosoftClarity = (() => {

    let loaded = false;

    console.log("MC: Clarity load called");

    if(loaded)
    {
        console.log("MC: Clarity already loaded")
    }

    

    // Replace with your Clarity Project ID
    const PROJECT_ID = window.TriSaar.Config.clarityProjectId;

    console.log("MC: ID - " & PROJECT_ID)

    function load() {

        if (loaded) {
            return;
        }

        loaded = true;

        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){
                (c[a].q=c[a].q||[]).push(arguments);
            };

            t=l.createElement(r);
            t.async=1;
            t.src="https://www.clarity.ms/tag/" + i;

            console.log("MC: Script created:", t.src);

            y=l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t,y);

        })(window, document, "clarity", "script", PROJECT_ID);

        console.log("MC: Microsoft Clarity loaded.");
    }

    function isLoaded() {
        return loaded;
    }

    return {
        load,
        isLoaded
    };

})();

window.TriSaar = window.TriSaar || {};
//window.TriSaar.MicrosoftClarity = MicrosoftClarity;

TriSaar.Providers.MicrosoftClarity = MicrosoftClarity;