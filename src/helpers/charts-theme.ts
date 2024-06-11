import * as am5 from "@amcharts/amcharts5";


class MyTheme extends am5.Theme {
    setupDefaultRules() {
        this.rule("Label").setAll({
            fontSize: 12,
            fill: am5.color(0x777777) // Default text color
        });

        this.rule("ColorSet").set("colors", [
            am5.color("#47077F"), // Accent-1
            am5.color("#6B0ABE"), // Accent-2
            am5.color("#DF8603"), // Accent-3
            am5.color("#FBA321"), // Accent-4
            am5.color("#FC4B28")  // Accent-5
        ]);
    }
}

export { MyTheme }