/**
 * Elicitation tool configuration.
 * All question content, bin grids, and module structure are defined here.
 * Editing this file is sufficient to change questions, bins, or ordering.
 */

const CONFIG = {
  title: "Expert Beliefs — Return to Learning Initiative",
  totalPoints: 100,

  // Response storage via GitHub repository_dispatch.
  // Generate a fine-grained PAT at: github.com → Settings → Developer settings →
  // Personal access tokens → Fine-grained tokens. Scope it to this repo only,
  // with Contents read/write permission.
  github: {
    owner: "jack-rossiter",
    repo: "beliefs",
    token: "PASTE_YOUR_FINE_GRAINED_PAT_HERE"
  },

  /* ── Module A: consent, background, tutorial, context ── */
  moduleA: {
    consent: {
      text: "This exercise is part of the Return to Learning Initiative, a research programme studying the long-run effects of improvements in early literacy. We are collecting beliefs from policymakers, practitioners and researchers about what happens to children who benefited from reading programmes, 15 years later.\n\nYour responses are confidential and will be used only for research purposes. The exercise takes approximately 25 minutes.\n\nBy proceeding, you consent to participate."
    },
    background: {
      fields: [
        { id: "name", label: "Name (optional)", type: "text" },
        {
          id: "role", label: "Which best describes your role?", type: "radio",
          options: ["Policymaker", "Practitioner", "Researcher", "Other"]
        },
        { id: "experience", label: "Years of experience working on education, labour markets, or related sectors in low- and middle-income countries", type: "number" },
        { id: "country", label: "Primary country of work", type: "text" }
      ]
    },
    tutorial: {
      title: "How this works",
      paragraphs: [
        "In this exercise, you will be asked to predict the long-term adult outcomes of children who gained additional early literacy skills — the kind of gains produced by reading interventions in low-income countries. For each question, you will see a set of bins representing different possible effect sizes.",
        "You have <strong>100 points</strong> to allocate across the bins. Each point represents a 1% probability. If you put 30 points in a bin, it means you think there is a 30% chance the true effect falls in that range.",
        "You can <strong>type numbers</strong> directly into the boxes next to each bin, or drag the sliders. A histogram will update in real time to show the shape of your belief distribution. Your points must add up to exactly 100 before you can proceed.",
        "Let\u2019s try a practice example first."
      ],
      practiceQuestion: {
        prompt: "What percentage of the world\u2019s population lives in Asia?",
        bins: [
          "30% or less", "31\u201335%", "36\u201340%", "41\u201345%", "46\u201350%",
          "51\u201355%", "56\u201360%", "61\u201365%", "66\u201370%", "71\u201375%",
          "76\u201380%", "81% or more"
        ],
        answer: "Approximately 59%. If most of your weight was in the 51\u201365% range, you\u2019re well calibrated!"
      }
    },
    context: {
      title: "Background on foundational literacy programmes",
      paragraphs: [
        "Over the past two decades, dozens of randomised evaluations have tested approaches to improving early reading skills among primary school children in low- and middle-income countries. These have included providing textbooks and other teaching materials, remedial instruction, structured pedagogy, teacher bonuses, and Teaching at the Right Level (TaRL).",
        "Short-run effects on reading assessments range widely: the 10th and 90th percentiles of impacts are approximately 0 and 0.5 standard deviations, respectively (Evans & Yuan, 2022). The gain described in this exercise \u2014 0.3 SD \u2014 sits near the centre of that range. To put this in perspective, a 0.3 SD gain would move a child from the 50th to about the 62nd percentile among her peers. In more concrete terms, a child reading about 10 correct words per minute can now read about 15.",
        "Children in some of the earliest trials are now in their mid-twenties. We want to know what <em>you</em> think happened to them."
      ]
    }
  },

  /* ── Module B: calibration (2 questions) ───────────────
     B3 (youth employment) dropped to avoid priming the
     Module C employment outcome.                          */
  calibrationIntro: "The next two questions are about known facts. They help us understand how people express uncertainty using this tool \u2014 there are no consequences for getting them wrong.",

  moduleB: [
    {
      id: "cal_literacy",
      prompt: "In low- and middle-income countries, what percentage of adults (aged 15 and older) can read and write a short, simple statement about their everyday life?",
      bins: [
        "20% or less", "21\u201325%", "26\u201330%", "31\u201335%", "36\u201340%",
        "41\u201345%", "46\u201350%", "51\u201355%", "56\u201360%", "61\u201365%",
        "66\u201370%", "71\u201375%", "76\u201380%", "81\u201385%", "86\u201390%",
        "91% or more"
      ],
      trueBin: 14
    },
    {
      id: "cal_completion",
      prompt: "Among young people aged 20\u201324 in low- and middle-income countries, what percentage have completed lower-secondary school (roughly 9\u201310 years of schooling)?",
      bins: [
        "20% or less", "21\u201325%", "26\u201330%", "31\u201335%", "36\u201340%",
        "41\u201345%", "46\u201350%", "51\u201355%", "56\u201360%", "61\u201365%",
        "66\u201370%", "71\u201375%", "76\u201380%", "81\u201385%", "86\u201390%",
        "91% or more"
      ],
      trueBin: 12
    }
  ],

  /* ── Module C: outcome elicitation ─────────────────────
     Bins use a symmetric fine zone (-5 to +5 at 1 pp),
     symmetric taper on both sides, and outcome-specific
     tails extending further where extreme effects are
     more plausible.                                       */

  vignette: "Over the past two decades, researchers have evaluated a variety of approaches to improving early reading skills among children in lower primary school (grades 1\u20133) in low-income countries. In a typical study, 100 schools were <strong>randomly assigned</strong> to receive the intervention and 100 schools served as comparisons. The interventions have taken different forms: some trained teachers in structured methods for reading instruction and provided classroom libraries and reading materials; others brought in teaching assistants or community volunteers to deliver targeted remedial lessons to children who were behind; still others reorganised classrooms so that children were grouped by reading level rather than by grade. Most ran for one school year or less.\n\nDespite their different designs, these interventions produced broadly similar short-run gains in reading. At the end of the intervention period, children in intervention schools scored on average <strong>0.3 standard deviations</strong> higher on standardised reading assessments than children in comparison schools. In practical terms, this means a child who could read about 10 correct words per minute can now read about 15 \u2014 roughly 5 additional correct words per minute. A child who was recognising letters but not yet reading words can now read simple words and short sentences.\n\nThese interventions have been implemented in many countries across sub-Saharan Africa and South Asia. We now go back and find these children <strong>15 years later</strong>. They are now <strong>aged about 25</strong>. We want to know what you think happened to them \u2014 not as a result of any single intervention or in any one country, but <strong>on average, how much did that improvement in early reading translate into better adult outcomes</strong> across the range of settings where these interventions took place.",

  moduleC: [
    {
      id: "completion",
      title: "Lower-secondary school completion",
      anchor: "Among children who did <strong>not</strong> receive these interventions, approximately <strong>40%</strong> completed lower-secondary school (roughly 9\u201310 years of schooling).",
      prompt: "How much do you think the improvement in early reading increased the share of children who completed lower-secondary school, on average across settings?",
      unit: "percentage-point change",
      bins: [
        "\u2264 \u221210", "\u22129 to \u22128", "\u22127 to \u22126",
        "\u22125", "\u22124", "\u22123", "\u22122", "\u22121",
        "0",
        "+1", "+2", "+3", "+4", "+5",
        "+6 to +7", "+8 to +9",
        "+10 to +14", "+15 to +20", "\u2265 +21"
      ]
    },
    {
      id: "employment",
      title: "Paid employment",
      anchor: "Among non-participants now aged about 25, approximately <strong>65%</strong> are in any form of paid work \u2014 whether formal employment, casual labour, or self-employment in a household enterprise \u2014 but not unpaid household or subsistence work.",
      prompt: "How much do you think the improvement in early reading increased the share of former participants who are in paid work, on average across settings?",
      unit: "percentage-point change",
      bins: [
        "\u2264 \u221210", "\u22129 to \u22128", "\u22127 to \u22126",
        "\u22125", "\u22124", "\u22123", "\u22122", "\u22121",
        "0",
        "+1", "+2", "+3", "+4", "+5",
        "+6 to +7", "+8 to +9",
        "+10 to +14", "\u2265 +15"
      ]
    },
    {
      id: "earnings",
      title: "Earnings",
      anchor: "Among non-participants now aged about 25 who are working, median monthly earnings are approximately <strong>$80 USD</strong> (adjusted for local purchasing power).",
      prompt: "How much do you think the improvement in early reading increased the earnings of former participants, on average across settings? Think in terms of the percentage change in monthly earnings.",
      unit: "percentage change",
      bins: [
        "\u2264 \u221210%", "\u22129 to \u22128%", "\u22127 to \u22126%",
        "\u22125%", "\u22124%", "\u22123%", "\u22122%", "\u22121%",
        "0%",
        "+1%", "+2%", "+3%", "+4%", "+5%",
        "+6 to +7%", "+8 to +9%",
        "+10 to +14%", "+15 to +20%", "+21 to +30%", "\u2265 +31%"
      ]
    },
    {
      id: "fertility",
      title: "Early pregnancy (female beneficiaries)",
      anchor: "Among female non-participants now aged about 25, approximately <strong>40%</strong> had their first child before age 20.",
      prompt: "How do you think the improvement in early reading affected the share of female former participants who had their first child before age 20, on average across settings? A negative number means early pregnancy was reduced; a positive number means it increased.",
      unit: "percentage-point change",
      bins: [
        "\u2264 \u221220", "\u221219 to \u221215", "\u221214 to \u221210",
        "\u22129 to \u22128", "\u22127 to \u22126",
        "\u22125", "\u22124", "\u22123", "\u22122", "\u22121",
        "0",
        "+1", "+2", "+3", "+4", "+5",
        "+6 to +7", "+8 to +9", "\u2265 +10"
      ]
    }
  ],

  policyRelevance: {
    prompt: "What is the smallest change in earnings you would consider substantively important \u2014 large enough to represent a meaningful improvement in people\u2019s economic lives? (This is not about your predictions \u2014 we are asking about the threshold below which you would consider the effect too small to matter.)",
    unit: "percentage change in earnings",
    label: "Minimum required percentage change in earnings"
  },

  /* ── Module D: heterogeneity & non-linearity ───────── */
  moduleD: {
    hetero: [
      {
        id: "hetero_completion",
        title: "Heterogeneity in completion effects",
        preamble: "You predicted the <strong>average</strong> effect on lower-secondary completion across settings. In practice, these interventions have been run in countries like <strong>Ghana, India, Liberia, and Uganda</strong> \u2014 places that differ considerably in their education systems, labour markets, and economic conditions.<br><br>We are not asking about your uncertainty \u2014 think about how much the true effect would genuinely differ from one country to another.<br><br><em>We ask about heterogeneity for two key outcomes to keep the exercise manageable.</em>",
        prompt: "What is the difference between the setting where the effect on completion is largest and the setting where it is smallest? For example, if the reading gain increases completion by 8 pp in the best setting and 2 pp in the worst, the range would be 6 pp. Use the bins to express how certain you are about this range \u2014 if you think it is probably around 6 but could be larger or smaller, spread your points across several nearby bins.",
        unit: "percentage-point difference",
        bins: [
          "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
          "11\u201312", "13\u201314", "15\u201317", "18\u201320", "21\u201325", "26\u201330", "\u2265 31"
        ]
      },
      {
        id: "hetero_earnings",
        title: "Heterogeneity in earnings effects",
        preamble: "Now think about the effect on <strong>earnings</strong>.",
        prompt: "What is the difference in the percentage change in earnings between the setting where the effect is largest and where it is smallest? For example, if earnings increase by 12% in the best setting and 2% in the worst, the range would be 10 percentage points. Use the bins to express how certain you are about this range \u2014 if you think it is probably around 10 but could be larger or smaller, spread your points across several nearby bins.",
        unit: "percentage-point difference in earnings effect",
        bins: [
          "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%",
          "11\u201312%", "13\u201314%", "15\u201317%", "18\u201320%", "21\u201325%", "26\u201330%", "\u2265 31%"
        ]
      }
    ],
    nonLinearity: {
      promptTemplate: "You just predicted what happens when children gain about 5 extra correct words per minute in reading (a 0.3 SD gain). Now imagine an intervention that produced twice that gain \u2014 about 10 extra correct words per minute (a 0.6 SD gain).\n\n{PERSONALISED_NOTE}Would you expect the long-run effects on adult outcomes to be:",
      options: [
        { value: "more_than_doubled", label: "More than doubled (bigger initial gains lead to disproportionately bigger long-run effects)" },
        { value: "roughly_doubled", label: "Roughly doubled (long-run effects scale proportionally with the reading gain)" },
        { value: "less_than_doubled", label: "Less than doubled (there are diminishing returns \u2014 twice the reading gain does not produce twice the long-run effect)" }
      ],
      followUp: "Please briefly explain your reasoning (optional):"
    }
  }
};
