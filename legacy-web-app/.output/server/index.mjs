globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HookableCore } from "./_libs/hookable.mjs";
import { d as defineLazyEventHandler, H as HTTPError, a as H3Core } from "./_libs/h3.mjs";
import { a as FastResponse } from "./_libs/srvx.mjs";




import "./_libs/rou3.mjs";




function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/firebase-messaging-sw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ff3-jLsI9dE5mo3QHSQLrJkR2N5W688"',
    "mtime": "2026-07-05T18:35:03.881Z",
    "size": 4083,
    "path": "../public/firebase-messaging-sw.js"
  },
  "/manifest.json": {
    "type": "application/json",
    "etag": '"25a-eNLoNYCMbbr9PSEGNEl6jtZ+9kM"',
    "mtime": "2026-07-05T18:35:03.881Z",
    "size": 602,
    "path": "../public/manifest.json"
  },
  "/assets/ai-compare-card--xlTcenu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d57-pYQrvkmLcil53RvvM7jNRto3kD8"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3415,
    "path": "../public/assets/ai-compare-card--xlTcenu.js"
  },
  "/assets/activity-BAvQ2inI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6f03-atHo3cOpSwhh+aGpg6NBTILvRT0"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 28419,
    "path": "../public/assets/activity-BAvQ2inI.js"
  },
  "/assets/ai-insights-B6LPQx9i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11a51-KFcP3jm3mTgshD4n817ix5m9Eo8"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 72273,
    "path": "../public/assets/ai-insights-B6LPQx9i.js"
  },
  "/assets/activity-B_-HQGGM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"eb-gUjXgRqGZOccZA4IJLvgLhZKC0E"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 235,
    "path": "../public/assets/activity-B_-HQGGM.js"
  },
  "/assets/ai-quick-panels-Cnutw4iA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"21a6-Q5eEuNthbSoPpzk4pLEcuJXKgOE"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 8614,
    "path": "../public/assets/ai-quick-panels-Cnutw4iA.js"
  },
  "/assets/ai-share-modal-CNIgU4jK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a2e-sTwAeVPM5ahBmJafTGaqdR4JHYo"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 2606,
    "path": "../public/assets/ai-share-modal-CNIgU4jK.js"
  },
  "/assets/api-Dv-17O77.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e86-j6G5ZhtFnsXQZCcaRHXQlJKFj78"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3718,
    "path": "../public/assets/api-Dv-17O77.js"
  },
  "/assets/arrow-left-BzInWJ1x.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-ybKcECS3lAStozG6u/Rw9xTmCB8"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 166,
    "path": "../public/assets/arrow-left-BzInWJ1x.js"
  },
  "/assets/arrow-right-BsvsI49V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-OXi6CvxdULLo0vna5cazHF9OMsI"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 166,
    "path": "../public/assets/arrow-right-BsvsI49V.js"
  },
  "/assets/arrow-up-right-f29gnlEP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a8-2OC82ppEV503WWzYvYeB9+vFV0s"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 168,
    "path": "../public/assets/arrow-up-right-f29gnlEP.js"
  },
  "/assets/attachment-lightbox-BoSe5RyU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8b4-1wp1OIy4lzsLwdzDR4zh9E13STc"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 2228,
    "path": "../public/assets/attachment-lightbox-BoSe5RyU.js"
  },
  "/assets/backup-center-CPNVsWc3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"42dd-HmOMIySNo3lKxrSBvslvsqVdNfw"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 17117,
    "path": "../public/assets/backup-center-CPNVsWc3.js"
  },
  "/assets/banknote-BTQjlOjw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f6-SkbDdTumPfB3WPCEQ4UH7+LxIj0"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 246,
    "path": "../public/assets/banknote-BTQjlOjw.js"
  },
  "/assets/banner-ads-e0GIwaao.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3167-ongsueeRrjmkjPmiFe0ZtVi6BzY"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 12647,
    "path": "../public/assets/banner-ads-e0GIwaao.js"
  },
  "/assets/bell-Bng24-kE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"123-zkTOn7GPs4aBBaFbkgzXB7RKuhY"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 291,
    "path": "../public/assets/bell-Bng24-kE.js"
  },
  "/assets/backup-restore-CGVomqBk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a9ce-taxVnt4sRFq5LSEkzKAGUILhmcg"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 109006,
    "path": "../public/assets/backup-restore-CGVomqBk.js"
  },
  "/assets/building-2-BzPPXMG9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"180-mJs99RPtwpoqA3bzrJ3zyu3UqyI"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 384,
    "path": "../public/assets/building-2-BzPPXMG9.js"
  },
  "/assets/calendar-days-Di18uSVA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1ef-10cTo2apM07RM3jwVB5SELwvOXI"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 495,
    "path": "../public/assets/calendar-days-Di18uSVA.js"
  },
  "/assets/browser-Cs2kZqsl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6332-3qz68DyMVtTquwlxYDAadkSvFEk"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 25394,
    "path": "../public/assets/browser-Cs2kZqsl.js"
  },
  "/assets/calendar-DeJoSI5O.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"102-9QYqog5S0fuYRr83Ow3Ol+AWtpI"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 258,
    "path": "../public/assets/calendar-DeJoSI5O.js"
  },
  "/assets/calendar-range-ycmKaYiV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a0-zyOLpy+YBDLiCQhQh0y/pGd6ju4"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 416,
    "path": "../public/assets/calendar-range-ycmKaYiV.js"
  },
  "/assets/chart-column-CgYNNvBP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc-sSJvO8FeRrpDKY93rzbO4qhJo8A"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 252,
    "path": "../public/assets/chart-column-CgYNNvBP.js"
  },
  "/assets/circle-alert-BtclTyuK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fb-sapl9aNQbC9XymTyHv61F6lYTmc"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 251,
    "path": "../public/assets/circle-alert-BtclTyuK.js"
  },
  "/assets/circle-arrow-up-Di0JnyzG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dc-81NH2GhsgVqMBJ58a8eM9F0S9Ok"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 220,
    "path": "../public/assets/circle-arrow-up-Di0JnyzG.js"
  },
  "/assets/coins-CXnXfSBz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11e-DHu5QmD418ZSrzBXHSEo8FWXndQ"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 286,
    "path": "../public/assets/coins-CXnXfSBz.js"
  },
  "/assets/circle-arrow-down-9-dzrNxQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dc-E0n/VZ582B5ScKPBOm8R29MNFNw"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 220,
    "path": "../public/assets/circle-arrow-down-9-dzrNxQ.js"
  },
  "/assets/collapsible-YkOODIDG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"66-pv3hyIU2oUKyD0pNxCDCQ1IoawY"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 102,
    "path": "../public/assets/collapsible-YkOODIDG.js"
  },
  "/assets/company-transactions-T31pM0Z4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3ebb-byllNHhakc9zzib1NE6Z0tLecmk"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 16059,
    "path": "../public/assets/company-transactions-T31pM0Z4.js"
  },
  "/assets/copy-lmuF2uMF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ed-yqEnuAPTm+6sw7ORNb1mlIIXBmo"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 237,
    "path": "../public/assets/copy-lmuF2uMF.js"
  },
  "/assets/dashboard-B1aYUTXC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"49c9-INqZOeytGXVjSsP9G4UllH5Y8To"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 18889,
    "path": "../public/assets/dashboard-B1aYUTXC.js"
  },
  "/assets/database-CCAoNF1B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f4-tSusvRvq3Fi5NOUmbWnXLJ+hVyI"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 244,
    "path": "../public/assets/database-CCAoNF1B.js"
  },
  "/assets/daily-closing-BXBWs3wB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b29b-U/8QK/KUzGmF9zkQTC1V/V5hzMQ"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 45723,
    "path": "../public/assets/daily-closing-BXBWs3wB.js"
  },
  "/assets/edit-history-BqLBhII-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d98-WMyU6BFNSCS9WJmLCmsKf6SYMig"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3480,
    "path": "../public/assets/edit-history-BqLBhII-.js"
  },
  "/assets/download-DhyHTk5G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e9-qMqiGK20a53Zez1ojqAQafif97A"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 233,
    "path": "../public/assets/download-DhyHTk5G.js"
  },
  "/assets/employee-wallet-DGfGwklq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a4c-rYw3KQYgqV4PIwib/36milZXLgE"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 2636,
    "path": "../public/assets/employee-wallet-DGfGwklq.js"
  },
  "/assets/ellipsis-vertical-Ci5sB4sP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ec-WtC7Uf0thtBrE2AHH1OaDieCWKw"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 236,
    "path": "../public/assets/ellipsis-vertical-Ci5sB4sP.js"
  },
  "/assets/employee-form-dialog-D1v4mzVZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1461-8Ljo2urPzZGMkMSR5ol28Npv70o"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 5217,
    "path": "../public/assets/employee-form-dialog-D1v4mzVZ.js"
  },
  "/assets/employees.index-DL1llUP7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1bb3-RaEdCeMb0KttHc/Noi1HxS70MEs"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 7091,
    "path": "../public/assets/employees.index-DL1llUP7.js"
  },
  "/assets/employees.expenses-DzabwXl5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3194-I9o+ne5+0Lbec8mOjYAPRmYCJY4"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 12692,
    "path": "../public/assets/employees.expenses-DzabwXl5.js"
  },
  "/assets/external-link-DrqvciCt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc-MpZ5LBNOPanyJrPg6jBH81HSpAE"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 252,
    "path": "../public/assets/external-link-DrqvciCt.js"
  },
  "/assets/employee-expense-dialog-BzMv4h6x.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b1e-4XP+iWAiulwxn7beUYWFhIVHa2g"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 6942,
    "path": "../public/assets/employee-expense-dialog-BzMv4h6x.js"
  },
  "/assets/employees._employeeId-y9A3D7za.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9855-Cz9l5waKy5yUUy8tBGgs194kYMY"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 38997,
    "path": "../public/assets/employees._employeeId-y9A3D7za.js"
  },
  "/assets/eye-off-CquvlN2y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1af-idP/WyvuT1HLgAeh4P+73zJ8xaY"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 431,
    "path": "../public/assets/eye-off-CquvlN2y.js"
  },
  "/assets/eye-C86PUyux.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"101-Rci5R+8KHFcinATqSFhGXnYyV8Q"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 257,
    "path": "../public/assets/eye-C86PUyux.js"
  },
  "/assets/file-down-CLPar1xY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"164-CPHF7HrkIleY5o4ATMTF48xIcvg"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 356,
    "path": "../public/assets/file-down-CLPar1xY.js"
  },
  "/assets/file-chart-column-increasing-CRNGMOp5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"198-J7fl00ae2FLk40EkfZ04tQY3bK8"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 408,
    "path": "../public/assets/file-chart-column-increasing-CRNGMOp5.js"
  },
  "/assets/file-spreadsheet-Dot1ZKDy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1ad-m3mnXNXEegTb+wIKCyBNht3uy6I"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 429,
    "path": "../public/assets/file-spreadsheet-Dot1ZKDy.js"
  },
  "/assets/file-text-BiJBs-Dk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"182-OF9LbbKRBUJv5IhrzPuEBoGwvJ0"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 386,
    "path": "../public/assets/file-text-BiJBs-Dk.js"
  },
  "/assets/find-product-image-dialog-DnhDUCRM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e28-NDONqGfua5ZIWbnSFENQyfhnjWQ"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3624,
    "path": "../public/assets/find-product-image-dialog-DnhDUCRM.js"
  },
  "/assets/finance-workflow-CF5lU-Jy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3be2-sitria7GcdOQ8Sqj1pkP9q1F77M"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 15330,
    "path": "../public/assets/finance-workflow-CF5lU-Jy.js"
  },
  "/assets/firebase-D8GctrX0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d6e7-GKg/49VXayufVU/L6LE+XYdsoto"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 55015,
    "path": "../public/assets/firebase-D8GctrX0.js"
  },
  "/assets/from-sale-BgUSNJBw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"458-ky1gc768oEkLcUchD9Nfof4fh0I"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 1112,
    "path": "../public/assets/from-sale-BgUSNJBw.js"
  },
  "/assets/format-C2qClSh7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4d30-SCvjGN8UZf8uxdG6Czy5tT0rx80"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 19760,
    "path": "../public/assets/format-C2qClSh7.js"
  },
  "/assets/global-ai-button-C2TXK5-X.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3e9-anHb1KfIOjgfvX7VZ4wodSKgQkA"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 1001,
    "path": "../public/assets/global-ai-button-C2TXK5-X.js"
  },
  "/assets/global-search-eouLqLwe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5e9c-5PqTgQaGB8v+o6L8X+5BVxS53rE"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 24220,
    "path": "../public/assets/global-search-eouLqLwe.js"
  },
  "/assets/grip-vertical-BGnbt3cb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"174-MZ7CWXmcAhFD7oQHIueZYT1mqh8"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 372,
    "path": "../public/assets/grip-vertical-BGnbt3cb.js"
  },
  "/assets/help-content-DpWVHgZa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2488-WA1Z0u350O5hmjnG6Pa2Mg6REVo"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 9352,
    "path": "../public/assets/help-content-DpWVHgZa.js"
  },
  "/assets/help-CYlKpov0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2eab-n5y2ThY+ugjcdnHW29whG8BmCXY"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 11947,
    "path": "../public/assets/help-CYlKpov0.js"
  },
  "/assets/history-CIqVyriC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ee-ayAnMMwAf56F90gkOM6UHWd8SA0"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 238,
    "path": "../public/assets/history-CIqVyriC.js"
  },
  "/assets/host-CyRwDlYK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d2b-ZeNSZRy9WorHMvcs6dSH5+hSYNE"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3371,
    "path": "../public/assets/host-CyRwDlYK.js"
  },
  "/assets/host-CR12iEhi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"924-2fecwLPf9G1jPwN/pSK0vl/LO8U"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 2340,
    "path": "../public/assets/host-CR12iEhi.js"
  },
  "/assets/image-upload-Ba6s3QUv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"558-pmLcAwTJ6BYfucs1lRrV7WH/Y3k"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 1368,
    "path": "../public/assets/image-upload-Ba6s3QUv.js"
  },
  "/assets/image-BtB--fJQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10e-fAJk0WlcN/0r3daA6TdEx7xfSuo"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 270,
    "path": "../public/assets/image-BtB--fJQ.js"
  },
  "/assets/index-BeoRn2gJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"35a0-73Bkr3TFJx40E9gIIAbFnzcEwZ4"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 13728,
    "path": "../public/assets/index-BeoRn2gJ.js"
  },
  "/assets/index-CgL4nyzd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"88b-OiQB/GtfWBiYPP4bZf5wJJoElzQ"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 2187,
    "path": "../public/assets/index-CgL4nyzd.js"
  },
  "/assets/html2canvas.esm-DXEQVQnt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"31151-TyUyRNm9rR2JDwpyAxcruTmmr6A"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 201041,
    "path": "../public/assets/html2canvas.esm-DXEQVQnt.js"
  },
  "/assets/index-D1-U6ips.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"101-tXRc+tQ0R4kauCx4EflaybcMeA0"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 257,
    "path": "../public/assets/index-D1-U6ips.js"
  },
  "/assets/index-FvAhtll0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6a17-uUaTT33Z0yd/n8lA7kL1eZ5/sdg"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 27159,
    "path": "../public/assets/index-FvAhtll0.js"
  },
  "/assets/index.es-BilkP_jt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"26c71-tkNfMjQUOaVi+9h5pvbtoyTQEd0"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 158833,
    "path": "../public/assets/index.es-BilkP_jt.js"
  },
  "/assets/index-JDP8bLU5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"70138-yHO+pCdplaTBpUKxCuo9dezWyQ4"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 459064,
    "path": "../public/assets/index-JDP8bLU5.js"
  },
  "/assets/info-CadgOIBX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"cd-9hhA51BQI1uoSnwSPbclVv0ovig"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 205,
    "path": "../public/assets/info-CadgOIBX.js"
  },
  "/assets/info-button-ClCYmkto.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7a5-xFOvJJBE/hKG4cY10Ff6SzI4rqE"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 1957,
    "path": "../public/assets/info-button-ClCYmkto.js"
  },
  "/assets/index-DXhm_e6C.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a7ba-3oz5H39LBQZm1jSLL715ccjffxs"',
    "mtime": "2026-07-05T18:41:19.256Z",
    "size": 1091514,
    "path": "../public/assets/index-DXhm_e6C.js"
  },
  "/assets/invoice-a4-share-host-BIx2vLqH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"50df-cEBIZht6Xg0qlRbfpnrq9HstXAk"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 20703,
    "path": "../public/assets/invoice-a4-share-host-BIx2vLqH.js"
  },
  "/assets/invoice-formats-DPFq7YEN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"900b-qExuXETfT7I+NQ+nW45keAH8W6E"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 36875,
    "path": "../public/assets/invoice-formats-DPFq7YEN.js"
  },
  "/assets/invoice-share-host-K7jcWFAX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"13fe-s9p4dHR1mrk9s+WoNcRTV4jAZkk"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 5118,
    "path": "../public/assets/invoice-share-host-K7jcWFAX.js"
  },
  "/assets/invoice-v2-host-I3JsT4e-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"844-e6zpmTjhyqGBbGxgJoOTbQ23DZg"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 2116,
    "path": "../public/assets/invoice-v2-host-I3JsT4e-.js"
  },
  "/assets/layout-dashboard-Bepquotc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"228-q8935dJYhd6AfNfb/6w47X1xLBo"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 552,
    "path": "../public/assets/layout-dashboard-Bepquotc.js"
  },
  "/assets/login-BRarTOC7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1099-+uopeKvgHWi8bVnh+XBjDuiSUzo"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 4249,
    "path": "../public/assets/login-BRarTOC7.js"
  },
  "/assets/low-stock-B_CpBW-P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f7e-M90ag0U9LIJN8FTEpXji86SZpdA"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 8062,
    "path": "../public/assets/low-stock-B_CpBW-P.js"
  },
  "/assets/mail-_1RaAAxn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d6-BC8bqqu/sBRoQEJ75ZwndgMf8eE"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 214,
    "path": "../public/assets/mail-_1RaAAxn.js"
  },
  "/assets/monthly-snapshot-AtDXXpEh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3c16-/OiZWc8v6zj84FiVxJX14Lg4gMA"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 15382,
    "path": "../public/assets/monthly-snapshot-AtDXXpEh.js"
  },
  "/assets/my-expenses-CXlGLUcb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1e78-bg3aQ0DrW7nDdF4PYqu8zFH6NEA"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 7800,
    "path": "../public/assets/my-expenses-CXlGLUcb.js"
  },
  "/assets/monthly-closing-L_sm9Eyy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3e8b-wEDaNOP4XqSHArGOU1omaUNkqIU"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 16011,
    "path": "../public/assets/monthly-closing-L_sm9Eyy.js"
  },
  "/assets/pencil-CnvyjWUm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"115-nsiugD0DmuEIdRNrkjPLYI26HTQ"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 277,
    "path": "../public/assets/pencil-CnvyjWUm.js"
  },
  "/assets/overview-D5Vl4KrM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"87ef-Xkb6S4L2NYTPUX9+iC3MDlPbaSM"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 34799,
    "path": "../public/assets/overview-D5Vl4KrM.js"
  },
  "/assets/product-image-upload-CVbun06P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"bd9-uUZZYfZgS+Ztj567tQEq9hifCs0"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 3033,
    "path": "../public/assets/product-image-upload-CVbun06P.js"
  },
  "/assets/profit-summary-F3YGde88.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8a83-UC3Fn5mf0gnmXxvE/gwLeEOzdZY"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 35459,
    "path": "../public/assets/profit-summary-F3YGde88.js"
  },
  "/assets/progress-BNIAUsww.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"76e-s9lxk3ZqW/tMJRvyTYLfcmnOtkM"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 1902,
    "path": "../public/assets/progress-BNIAUsww.js"
  },
  "/assets/purify.es-CC4Brkr_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6d2e-2hLeKeMzBLvyKsjs4nyXOoNsJTU"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 27950,
    "path": "../public/assets/purify.es-CC4Brkr_.js"
  },
  "/assets/price-compare-BDbzaeQO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e7c3-Hjbge1QL69aV6wD48ztQaefiB40"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 59331,
    "path": "../public/assets/price-compare-BDbzaeQO.js"
  },
  "/assets/push-test-BmgIuQlS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1eba-Y3dAViB7eCFFnfS3y/PA3OFWqwM"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 7866,
    "path": "../public/assets/push-test-BmgIuQlS.js"
  },
  "/assets/jspdf.es.min-PJAwSMrI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5e48d-Q6lG78SLxpzvdZSL5BLWF7UFtxQ"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 386189,
    "path": "../public/assets/jspdf.es.min-PJAwSMrI.js"
  },
  "/assets/receipt-CrGA3fKu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"125-MVSbDd96vbmjRuAQgmcd7MT+N7o"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 293,
    "path": "../public/assets/receipt-CrGA3fKu.js"
  },
  "/assets/recycle-bin-CYpslnv6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3ccc-6Qf+8YKChZE9mXGaruGmuQ61zMg"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 15564,
    "path": "../public/assets/recycle-bin-CYpslnv6.js"
  },
  "/assets/reports-DhjS-5tT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1bd4c-4A44Dpy/6Y3cuGNKXYRc1XDzKEU"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 113996,
    "path": "../public/assets/reports-DhjS-5tT.js"
  },
  "/assets/refresh-cw-aRg6rGDl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"142-+auXIQqkQ4d1WqyvoaDAnye5LDE"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 322,
    "path": "../public/assets/refresh-cw-aRg6rGDl.js"
  },
  "/assets/sales-return-BEy4xfIi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"443e-GEqxZE984CqdVcmSnQQ/xcsHqo4"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 17470,
    "path": "../public/assets/sales-return-BEy4xfIi.js"
  },
  "/assets/sales-returns-CwJv319_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"30f-1FRfb6drFJdZ5Cm+sLgASd4fNvY"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 783,
    "path": "../public/assets/sales-returns-CwJv319_.js"
  },
  "/assets/sar-amount-OpCe9x-5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3f2-163WRSCNtTbm9O3vuv0qCCkr60U"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 1010,
    "path": "../public/assets/sar-amount-OpCe9x-5.js"
  },
  "/assets/send-ARpCKYJ0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"123-YQUbcQizfOfX9CNFRrB6T560hME"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 291,
    "path": "../public/assets/send-ARpCKYJ0.js"
  },
  "/assets/settings-2-CLILYBbc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fd-9y7XAZz4xHwFE1L3Tn3Egf5Wr14"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 253,
    "path": "../public/assets/settings-2-CLILYBbc.js"
  },
  "/assets/share-2-BIPpfW2a.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"166-AI01sj0ZDrRvjmqkaQOSJCWGQi8"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 358,
    "path": "../public/assets/share-2-BIPpfW2a.js"
  },
  "/assets/settings-BLCubtjt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"74e0-IyM/zgtStSWXOpM9Qot0HII9MGE"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 29920,
    "path": "../public/assets/settings-BLCubtjt.js"
  },
  "/assets/save-Ctp41udd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"148-yMd5mEM8AZnylpsq1vokpUNLpMg"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 328,
    "path": "../public/assets/save-Ctp41udd.js"
  },
  "/assets/share-CaOR867p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3ff3-tQ8J4sa1D2w0yjUxRQs5KwcmBx4"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 16371,
    "path": "../public/assets/share-CaOR867p.js"
  },
  "/assets/share-HKVXC642.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4468-lZIJundDTtK2nvP65vrMlwqGAiM"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 17512,
    "path": "../public/assets/share-HKVXC642.js"
  },
  "/assets/shop-D3ZRJpJy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1dbe6-Nhjh21kR7htT62ySrQJR8jRPuYk"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 121830,
    "path": "../public/assets/shop-D3ZRJpJy.js"
  },
  "/assets/shop-drilldown-sheet-sbxEsS0M.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3fe7-QFBAH6dgInKTodzi4qAgycK0VFw"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 16359,
    "path": "../public/assets/shop-drilldown-sheet-sbxEsS0M.js"
  },
  "/assets/skeleton-BFijXIgG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"260-Jtp65tzN+Fe8YX9DGExJSs+w138"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 608,
    "path": "../public/assets/skeleton-BFijXIgG.js"
  },
  "/assets/share-DIrmiYNB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"53a2-YyDKtJZQJq0wI8d0aLcUKmP0D2g"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 21410,
    "path": "../public/assets/share-DIrmiYNB.js"
  },
  "/assets/soft-delete-DJkkilfq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7d8-xbFPU4eAsZUIJ40g1hk+UPEgJYY"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 2008,
    "path": "../public/assets/soft-delete-DJkkilfq.js"
  },
  "/assets/sliders-horizontal-B9Hg7hdb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a9-4YHlqHRl7BiO+zU0g1Y2JNs/67s"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 425,
    "path": "../public/assets/sliders-horizontal-B9Hg7hdb.js"
  },
  "/assets/smart-query-BeBelyRj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d59-seWfKUIjuDIchjzDTJCkUeWDGU4"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3417,
    "path": "../public/assets/smart-query-BeBelyRj.js"
  },
  "/assets/stock-count.index-CgXgsz_N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"536c-ssKQRP1/wjAPvd/EiYgpms0vHmc"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 21356,
    "path": "../public/assets/stock-count.index-CgXgsz_N.js"
  },
  "/assets/stock-count._sessionId-CdAimg0G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b3c3-hwk8NyLhR8+5GsuxWLsF/B7s0MA"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 46019,
    "path": "../public/assets/stock-count._sessionId-CdAimg0G.js"
  },
  "/assets/store-admin-BPm3DZsF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3df9d-JShP+yaVKkkQxy+a9kxONK4Sa9Y"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 253853,
    "path": "../public/assets/store-admin-BPm3DZsF.js"
  },
  "/assets/store-BcmuAXNw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"102a4-84T2++rYpru4+GzAxvZJplytiX4"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 66212,
    "path": "../public/assets/store-BcmuAXNw.js"
  },
  "/assets/store-UqkuyGYa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f3-SXwJ+Hml4PMJ1YHm3YucX29eP3U"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 499,
    "path": "../public/assets/store-UqkuyGYa.js"
  },
  "/assets/styles-C1ikfg6z.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"3c594-lzYyNqnHYU/4vO/hUE4dY81n4Kw"',
    "mtime": "2026-07-05T18:41:19.238Z",
    "size": 247188,
    "path": "../public/assets/styles-C1ikfg6z.css"
  },
  "/assets/summary-kh1n4FCv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"475a-08EHKtl0AmJ8pVCSzxig6MbYVoU"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 18266,
    "path": "../public/assets/summary-kh1n4FCv.js"
  },
  "/assets/switch-CSptzjZE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d83-FfXcLoKnKVNjq+U8fpUEr3dD9lc"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3459,
    "path": "../public/assets/switch-CSptzjZE.js"
  },
  "/assets/tag-BRmESxQ_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"147-rdeluYMFG4al58fDcWdu96l2JrA"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 327,
    "path": "../public/assets/tag-BRmESxQ_.js"
  },
  "/assets/team-DnZ3QMWD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"597a-JW87yIexAeY8OLpAqnvW1nHtWKg"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 22906,
    "path": "../public/assets/team-DnZ3QMWD.js"
  },
  "/assets/themes-panel-CEdrSPy2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1230-p4/494bTT9Y81+gN5V2HBsAwUW0"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 4656,
    "path": "../public/assets/themes-panel-CEdrSPy2.js"
  },
  "/assets/trending-down-v9J4LB5z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b3-OZFFgm9zK60DkyUS1kWCfIT/aN8"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 179,
    "path": "../public/assets/trending-down-v9J4LB5z.js"
  },
  "/assets/truck-thU5_Zbi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4ba-kV86fHl3YfkGCaS+e20Rc9BUBtA"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 1210,
    "path": "../public/assets/truck-thU5_Zbi.js"
  },
  "/assets/trending-up-6F9VQ2Go.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b0-jhaMYshqpgI7zkmyYCUfsHeQIDg"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 176,
    "path": "../public/assets/trending-up-6F9VQ2Go.js"
  },
  "/assets/use-fcm-CNuHxE99.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7cb-X7MLIR+yd30R8shqKZ+9esguDoo"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 1995,
    "path": "../public/assets/use-fcm-CNuHxE99.js"
  },
  "/assets/types-DF86NaQT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a0-Jq1wu51h5EqM4MB9rJlyzLh4GWo"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 160,
    "path": "../public/assets/types-DF86NaQT.js"
  },
  "/assets/use-store-profile-D4dHANtC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6be-G/y+CkmG6YOedUbjjSZqSILtNxw"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 1726,
    "path": "../public/assets/use-store-profile-D4dHANtC.js"
  },
  "/assets/use-shop-positions-D9bcD712.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"822-wDWV1AS/o1mQywBoKHcuMEQr5Eg"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 2082,
    "path": "../public/assets/use-shop-positions-D9bcD712.js"
  },
  "/assets/use-wholesale-financials-WgDsrO0f.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3ff-P3d+jWjcohe7J9UabYjvDSiKUwY"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 1023,
    "path": "../public/assets/use-wholesale-financials-WgDsrO0f.js"
  },
  "/assets/warehouse-rvRTXLyS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"178-Ld2x+VZJqZIzkJqXu8bSlzpbap0"',
    "mtime": "2026-07-05T18:41:19.251Z",
    "size": 376,
    "path": "../public/assets/warehouse-rvRTXLyS.js"
  },
  "/assets/web-dxMD_78h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d79-MEvrL2vFNzMyTCFEmkrQpr25JFw"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 3449,
    "path": "../public/assets/web-dxMD_78h.js"
  },
  "/assets/website-banners-DN7G2S9g.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"26a4-dEtplR2zr9+U3chCg80UGgPgBEw"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 9892,
    "path": "../public/assets/website-banners-DN7G2S9g.js"
  },
  "/assets/whatsapp-share-DHhzT38S.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11b6-n+950qmRK+TpXfI2Qs+ANGoWYqY"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 4534,
    "path": "../public/assets/whatsapp-share-DHhzT38S.js"
  },
  "/assets/zatca-qr-B5jWTZCt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24e-LYoBW/2fVDU/N4ByKQrTyZsRETs"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 590,
    "path": "../public/assets/zatca-qr-B5jWTZCt.js"
  },
  "/assets/xlsx-BUPf39EI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"67a47-di6ZSYrVx5m5HMS7Gt8h2YB0dVg"',
    "mtime": "2026-07-05T18:41:19.252Z",
    "size": 424519,
    "path": "../public/assets/xlsx-BUPf39EI.js"
  },
  "/assets/_app-D3KZxSe-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"14939-MfuhDn0qLuBM796ZnpMKBtUycbg"',
    "mtime": "2026-07-05T18:41:19.253Z",
    "size": 84281,
    "path": "../public/assets/_app-D3KZxSe-.js"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_UqiQGP = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_UqiQGP };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function createHandler(hooks) {
  const nitroApp = useNitroApp();
  const nitroHooks = useNitroHooks();
  return {
    async fetch(request, env, context) {
      globalThis.__env__ = env;
      augmentReq(request, {
        env,
        context
      });
      const ctxExt = {};
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url, ctxExt);
        if (res) {
          return res;
        }
      }
      return await nitroApp.fetch(request);
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
        controller,
        env,
        context
      }) || Promise.resolve());
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:email", {
        message,
        event: message,
        env,
        context
      }) || Promise.resolve());
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
        batch,
        event: batch,
        env,
        context
      }) || Promise.resolve());
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
        traces,
        env,
        context
      }) || Promise.resolve());
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
        traces,
        env,
        context
      }) || Promise.resolve());
    }
  };
}
function augmentReq(cfReq, ctx) {
  const req = cfReq;
  req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx
  };
  req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
