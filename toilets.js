// Toilets & sanitary ware, shared by index.html and catalogue.html.
// To add or change a product, edit this list: both pages update.
// type: One-Piece | Two-Piece | Combo | Pan & Cistern   (used for the filter tabs on the home page)
(function () {
  var CAT = "Toilets & Sanitary Ware";
  var WASH = "Washdown flush, P-trap, 180mm rough-in";
  function t(code, name, type, finish, size, note, img) {
    return { code: code, name: name, cat: CAT, type: type, finish: finish, size: size, note: note, img: "img/toilets/" + img + ".jpg" };
  }
  window.TOILETS = [
    // ---- Toilet + wall-hung basin combos ----
    t("WC-788", "One-Piece Toilet (Combo with HB-788 Basin)", "Combo", "White, black line", "700x380x745mm", WASH, "wc-788"),
    t("HB-788", "Wall-Mounted Washbasin (matches WC-788)", "Combo", "White marble", "500x450x390mm", "Matching basin, fired at 1280 degrees", "hb-788"),
    t("WC-791", "One-Piece Toilet (Combo with HB-791 Basin)", "Combo", "White and gold marble", "700x380x745mm", WASH, "wc-791"),
    t("HB-791", "Wall-Mounted Washbasin (matches WC-791)", "Combo", "White and gold marble", "500x450x390mm", "Matching basin, fired at 1280 degrees", "hb-791"),
    t("WC-790", "One-Piece Toilet (Combo with HB-790 Basin)", "Combo", "Grey with gold line", "700x380x745mm", WASH, "wc-790"),
    t("HB-790", "Wall-Mounted Washbasin (matches WC-790)", "Combo", "Grey with gold line", "500x450x390mm", "Matching basin, fired at 1280 degrees", "hb-790"),

    // ---- One-piece toilets ----
    t("WC-305", "One-Piece Toilet", "One-Piece", "White", "690x370x760mm", WASH, "wc-305"),
    t("WC-306", "One-Piece Toilet, Square Fully-Skirted", "One-Piece", "White", "670x370x800mm", WASH, "wc-306"),
    t("WC-8617", "One-Piece Toilet, Square Fully-Skirted", "One-Piece", "White", "700x380x745mm", WASH, "wc-8617"),
    t("WC-6224", "One-Piece Toilet, Ultra-Thin Tank", "One-Piece", "White", "680x390x780mm", WASH, "wc-6224"),
    t("WC-303", "One-Piece Toilet", "One-Piece", "White", "650x360x745mm", WASH, "wc-303"),

    // ---- Two-piece (close-coupled) toilets ----
    t("WC-046", "Two-Piece Toilet, Hyper Flush", "Two-Piece", "White", "610x345x800mm", WASH, "wc-046"),
    t("WC-029", "Two-Piece Toilet, Ultra-Thin Tank", "Two-Piece", "White", "640x380x810mm", WASH, "wc-029"),
    t("WC-045", "Two-Piece Toilet, Ultra-Thin Tank", "Two-Piece", "White", "650x340x770mm", WASH, "wc-045"),
    t("WC-100", "Two-Piece Toilet, Hyper Flush", "Two-Piece", "White", "670x370x780mm", WASH, "wc-100"),
    t("WC-664", "Two-Piece Toilet, Hyper Flush", "Two-Piece", "White", "670x390x730mm", WASH, "wc-664"),
    t("WC-008", "Two-Piece Toilet, Hyper Flush", "Two-Piece", "White", "640x350x755mm", WASH, "wc-008"),
    t("WC-009", "Two-Piece Toilet, Pressure-Resistant", "Two-Piece", "White", "699x416x790mm", WASH, "wc-009"),
    t("WC-006", "Two-Piece Toilet, Hyper Flush", "Two-Piece", "White", "655x357x725mm", WASH, "wc-006"),
    t("WC-5096", "Two-Piece Toilet, Hyper Flush", "Two-Piece", "White", "700x380x790mm", WASH, "wc-5096"),
    t("WC-001B", "Two-Piece Toilet, Coloured", "Two-Piece", "Blue", "700x450x780mm", WASH, "wc-001b"),
    t("WC-001P", "Two-Piece Toilet, Coloured", "Two-Piece", "Pink", "700x450x780mm", WASH, "wc-001p"),
    t("WC-004", "Two-Piece Toilet with Low-Level Cistern", "Two-Piece", "White", "470x355x395mm", "Washdown flush, P-trap, 180mm rough-in. Cistern EWC-001W 495x210x310mm", "wc-004"),

    // ---- Squat pans and cisterns ----
    t("C.T PAN White", "Squatting Pan", "Pan & Cistern", "White", "500x400x155mm", "Squatting pan", "pan-white"),
    t("C.T PAN Blue", "Squatting Pan", "Pan & Cistern", "Blue", "500x400x155mm", "Squatting pan", "pan-blue"),
    t("C.T PAN Pink", "Squatting Pan", "Pan & Cistern", "Pink", "500x400x155mm", "Squatting pan", "pan-pink"),
    t("WT-02D", "Slim Flush Cistern", "Pan & Cistern", "White", "375x360x105mm", "Slim flush cistern", "wt-02d")
  ];
})();
