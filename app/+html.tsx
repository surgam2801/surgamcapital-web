import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

// This file is web-only and used to configure the root HTML for every web page during static rendering.
// The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Surgam - A Calmer Way to Understand & Grow Your Long-Term Money Plan</title>
        <ScrollViewStyleReset />
        
        {/* Google Website Translator library script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,ta,te,bn,mr,gu,kn,ml,pa,ur,es,fr,de,ar,zh-CN,ja',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `,
          }}
        />
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />

        {/* Global theme styling for Google Translate element */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Hide top banner frame that Google adds by default */
              .goog-te-banner-frame.skiptranslate {
                display: none !important;
              }
              body {
                top: 0px !important;
              }
              .goog-tooltip {
                display: none !important;
              }
              .goog-tooltip:hover {
                display: none !important;
              }
              .goog-text-highlight {
                background-color: transparent !important;
                box-shadow: none !important;
              }
              /* Style the Google combo dropdown to match Surgam palette */
              .goog-te-gadget-simple {
                background-color: #FFFFFF !important;
                border: 1px solid #DCE7E2 !important;
                padding: 6px 12px !important;
                border-radius: 12px !important;
                font-family: inherit !important;
                font-size: 13px !important;
                font-weight: 700 !important;
                color: #10211D !important;
                display: inline-flex !important;
                align-items: center !important;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
