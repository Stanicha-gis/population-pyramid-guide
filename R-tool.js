function toVector(str) {
    return str
        .split(",")
        .map(s => s.trim())
        .join(", ");
}

document.querySelectorAll('input[name="legend-pos"]').forEach(radio => {
  radio.addEventListener("change", function() {
    document.getElementById("legend-coord-box").style.display =
      this.value === "coord" ? "block" : "none";
  });
});


document.getElementById("generateBtn").addEventListener("click", function () {

    const maleVec = toVector(document.getElementById("maleLabel").value);
    const femaleVec = toVector(document.getElementById("femaleLabel").value);
    const ageVec = toVector(document.getElementById("ageVar").value);
    const ageclassFontsize = document.getElementById("ageclass-fontSize").value;
    const horizontalMax = toVector(document.getElementById("horixix-Max").value);
    const horizontalScale = toVector(document.getElementById("horixix-scale").value);
    const scaleFont = toVector(document.getElementById("scale-fontSize").value)
    const gridNone = document.getElementById("grid-none").checked;
    const maleColor = document. getElementById("maleColor").value;
    const femaleColor = document.getElementById("femaleColor").value;
    const verticalLabel = toVector(document.getElementById("vertical-axix-label").value);
    const horizontalLabel = toVector(document.getElementById("horizontal-axix-label").value);
    const verticalNone = document.getElementById("vertical-none").checked;
    const horizontalNone = document.getElementById("horizontal-none").checked;
    const legendSex = toVector(document.getElementById("legend-sex").value);
    const legendMale = toVector(document.getElementById("legend-male").value);
    const legendFemale = toVector(document.getElementById("legend-female").value);
    const legendPos = document.querySelector('input[name="legend-pos"]:checked').value;
    const legendNone = document.getElementById("legend-none").checked;
    const titleLabel = toVector(document.getElementById("title-label").value);
    const titleNone = document.getElementById("title-none").checked;

    let xLabelCode = "";
    let yLabelCode = "";

    if (horizontalNone) {
    xLabelCode = `x = NULL`;
    } else {
    xLabelCode = `x = "${horizontalLabel}"`;
    }
    
    if (verticalNone) {
    yLabelCode = `y = NULL`;
    } else {
    yLabelCode = `y = "${verticalLabel}"`;
    }

    let legendCode = "";
    if (legendNone){
      legendCode=`legend.position="none",`
    }
    else if (legendPos === "coord") {
        const lx = document.getElementById("legend-x").value;
        const ly = document.getElementById("legend-y").value;
        legendCode = `legend.position = c(${lx}, ${ly}),`;
    } else {
        legendCode = `legend.position = "${legendPos}",`;
    }


    let gridCode = "";
    if (gridNone) {
        gridCode = ``
  } else {
        gridCode = `
    panel.grid.major.x = element_line(linewidth = ${scaleFont}, color = "black"),
    panel.grid.minor.x = element_blank(),`;
  }


    let titleCode = "";

    if (titleNone) {
    titleCode = `ggtitle(NULL)`;
    } else {
      titleCode = `ggtitle("${titleLabel}")`;
    }

    const code = `
library(ggplot2)
library(dplyr)
library(tidyr)
library(scales)

male <- c(${maleVec})
female <- c(${femaleVec})
age_group <- c(${ageVec})

df <- data.frame(
  Age = factor(age_group, levels = age_group),
  Male = -male,
  Female = female
)
df_long <- df %>%
  pivot_longer(cols = c("Male","Female"),
               names_to = "Sex", values_to = "Population")
  df_long$Sex <- factor(df_long$Sex, levels = c("Male", "Female"))

  ggplot(df_long, aes(x = Population, y = Age, fill = Sex)) +
  geom_bar(stat = "identity", width = 0.9) +
  geom_vline(xintercept = 0, color = "white", linewidth = 2) +
  scale_x_continuous(
    limits = c(${horizontalMax}),
    breaks = c(${horizontalScale}),
    labels = function(x) comma(abs(x)),
    expand = c(0,0)
) +
  scale_fill_manual(name = "${legendSex}",values = c("Male" = "${maleColor}", "Female" = "${femaleColor}"),labels = c("Male" = "${legendMale}", "Female" = "${legendFemale}")
) +
${titleCode} +
  labs(${xLabelCode}, ${yLabelCode}) +
  theme_minimal(base_size = 18) +
  theme(
${legendCode}
    plot.title = element_text(hjust = 0.5, face = "bold"),
    legend.text = element_text(face = "bold", size = 16),
    legend.title = element_text(face = "bold", size = 16),
    axis.text.y = element_text(size = ${ageclassFontsize}, face = "bold"),
    axis.ticks.y = element_blank(),
    axis.text.x = element_text(size = 14),
${gridCode}
    axis.title.x = element_text(size = 16, face = "bold"),
    axis.title.y = element_text(size = 16, face = "bold"),
    plot.margin = margin(10, 40, 10, 40)
)
`.trim();


    document.getElementById("codeOutput").textContent = code;
});

document.getElementById("copyBtn").addEventListener("click", function () {
    const code = document.getElementById("codeOutput").textContent;
    navigator.clipboard.writeText(code);

    const circle = document.getElementById("copyCircle");
    circle.style.display = "block";

    setTimeout(() => {
        circle.style.display = "none";
    }, 1500);
});

const order = [
    "maleLabel",
    "femaleLabel",
    "ageVar",
    "horixix-Max",
    "horixix-scale",
    "scale-fontSize",
    "vertical-axix-label",
    "horizontal-axix-label",
    "legend-sex",
    "legend-male",
    "legend-female",
    "title-label"
];
order.forEach((id, index) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const next = document.getElementById(order[index + 1]);
            if (next) next.focus();
        }
    });
});