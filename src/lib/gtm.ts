/** Google Tag Manager container, loaded on every page from the root layout. */
export const GTM_ID = "GTM-KP2P5CHB";

/** Google's standard head snippet. */
export const gtmHeadScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

/** Fallback for visitors with JavaScript off. */
export const gtmNoscriptSrc = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
