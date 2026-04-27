/**
 * Elicitation tool configuration.
 * All question content, bin grids, and module structure are defined here.
 * Editing this file is sufficient to change questions, bins, or ordering.
 */

const CONFIG = {
  title: "Expert Beliefs \u2014 Return to Learning Initiative",
  totalPoints: 100,

  // Response storage via GitHub repository_dispatch.
  // The token is injected at deploy time from the repository secret GH_DISPATCH_TOKEN.
  // See README or deploy.yml for setup instructions.
  github: {
    owner: "jack-rossiter",
    repo: "beliefs",
    token: "__GH_DISPATCH_TOKEN__"
  },

  /* ── Module A: consent, background, tutorial ── */
  moduleA: {
    consent: {
      text: "This exercise is part of the Return to Learning Initiative, a research programme studying the long-run effects of improvements in early literacy.\n\nWe are collecting beliefs from policymakers, practitioners and researchers about what differences early reading programmes make, 15 years later.\n\nYour responses are confidential and will be used only for research purposes.\n\nThe exercise takes approximately 20 minutes.\n\nBy proceeding, you consent to participate.\n\nThank you for your time."
    },
    background: {
      fields: [
        {
          id: "role", label: "Which best describes your role? (required)", type: "radio",
          options: ["Policymaker", "Practitioner", "Researcher", "Other"]
        },
        { id: "name", label: "Name (optional)", type: "text" },
        { id: "experience", label: "Years of experience working on education, labour markets, or related sectors in low- and middle-income countries (optional)", type: "number" },
        { id: "country", label: "Primary country of work (optional)", type: "text" }
      ]
    },
    tutorial: {
      title: "How this works",
      paragraphs: [
        "You will be asked to predict the long-term adult outcomes of children who gained additional early literacy skills several years ago. For each question, you will see a set of bins representing different possible outcomes.",
        "You always have <strong>100 points</strong> to allocate across the bins. Each point represents a 1% probability. If you put 30 points in a bin, it means you think there is a 30% chance the true effect falls in that range. If you are fairly sure the effect falls in a narrow range, most of your points will be concentrated in a few bins. If you are less sure, your points will naturally be spread more widely.",
        "You can <strong>type numbers</strong> directly into the boxes next to each bin, or drag the sliders. A histogram will update in real time to show your beliefs. When your points add up to exactly 100 you can proceed.",
        "First, there\u2019s a simple example to test how the slider works."
      ],
      practiceQuestion: {
        prompt: "What percentage of the world\u2019s population lives in Asia?",
        tip: "Tip: type numbers directly into the boxes, or drag the sliders.",
        bins: [
          "0\u20139.9%", "10\u201319.9%", "20\u201329.9%", "30\u201339.9%", "40\u201349.9%",
          "50\u201359.9%", "60\u201369.9%", "70\u201379.9%", "80\u201389.9%", "90\u2013100%"
        ],
        answer: "Approximately 60%. If most of your points were in and around the 50\u201370% range, well done!"
      }
    }
  },

  /* ── Vignette ──────────────────────────────────── */

  vignette: "Over the past two decades, dozens of <strong>randomised evaluations</strong> have tested approaches to improving <strong>early reading skills</strong> among children in primary schools in <strong>low- and middle-income countries</strong>, particularly across sub-Saharan Africa and South Asia. Children from some of the earliest trials are now in their twenties and early thirties.\n\nThe programmes have taken many different forms: some trained teachers in new methods for instruction, others provided reading materials, others offered bonuses to teachers for improved student performance, others recruited teaching assistants to deliver remedial lessons, still others reorganised classrooms so that children were grouped by level rather than by grade.\n\nMost programmes targeted children in <strong>Grades 1 through 4</strong> and ran for <strong>one school year or less</strong>. In each evaluation, schools were <strong>randomly assigned</strong> to either receive the programme or serve as comparisons. Some approaches were more effective than others, but across evaluations, almost all estimated short-run effects on reading scores were between <strong>zero and 0.5 standard deviations</strong>.",

  vignetteTask: "Imagine we select several of these programmes, from low- and middle-income countries, each with an evaluated gain of <strong>0.3 Standard Deviations (SD)</strong> in reading scores.\n\nWe will go back and find both groups, those who received each programme and those in comparison schools, <strong>15 years later</strong>. They will be <strong>aged about 25</strong>.\n\nWe want to know what differences you think that early boost in reading made in their lives.\n\nWe are asking about the <strong>average differences across these settings</strong>, not about any single programme or country. How much do you expect that early improvement in reading to have translated into changes in adult outcomes?\n\nWe will ask you about four outcomes: whether they completed lower-secondary school, whether they are in paid work, how much they earn if they are working, and whether women had their first child before the age of 20.",

  vignetteTaskAnchor: "In practical terms, a 0.3 SD gain means that a child who could read about 10 correct words per minute at baseline could read about 15 by the end of the programme, or a child who was recognising letters but not yet reading words at baseline could read several simple words at the end of the programme.",

  /* ── Module C: outcome elicitation ─────────────── */

  moduleC: [
    {
      id: "completion",
      title: "Lower-secondary school completion",
      anchor: "Among adults from comparison schools, approximately <strong>40%</strong> completed lower-secondary school (typically 9\u201310 years of schooling).",
      prompt: "How many percentage points higher or lower do you think lower-secondary completion was among those who received the 0.3 SD reading boost, on average across settings?",
      unit: "percentage-point difference",
      bins: [
        "\u2264 \u22126.1", "\u22126 to \u22124.1", "\u22124 to \u22122.1", "\u22122 to \u22120.1",
        "0 to +1.9", "+2 to +3.9", "+4 to +5.9",
        "+6 to +7.9", "+8 to +9.9",
        "+10 to +14.9", "\u2265 +15"
      ]
    },
    {
      id: "employment",
      title: "Paid work",
      anchor: "Among adults from comparison schools, now aged about 25, approximately <strong>65%</strong> are in any form of paid work. That includes formal employment, casual labour, or self-employment in a household enterprise, but not unpaid household or subsistence work.",
      prompt: "How many percentage points higher or lower do you think the share in paid work is among those who received the 0.3 SD reading boost, on average across settings?",
      unit: "percentage-point difference",
      bins: [
        "\u2264 \u22126.1", "\u22126 to \u22124.1", "\u22124 to \u22122.1", "\u22122 to \u22120.1",
        "0 to +1.9", "+2 to +3.9", "+4 to +5.9",
        "+6 to +7.9", "+8 to +9.9",
        "+10 to +14.9", "\u2265 +15"
      ]
    },
    {
      id: "earnings",
      title: "Earnings",
      anchor: "Among adults from comparison schools who are working, now aged about 25, average (median) monthly earnings are approximately <strong>$80 USD</strong> (adjusted for local purchasing power).",
      prompt: "How much higher or lower (in percentage terms) do you think monthly earnings are among those who received the 0.3 SD reading boost, on average across settings?",
      unit: "percentage difference",
      bins: [
        "\u2264 \u22126.1%", "\u22126% to \u22124.1%", "\u22124% to \u22122.1%", "\u22122% to \u22120.1%",
        "0% to +1.9%", "+2% to +3.9%", "+4% to +5.9%",
        "+6% to +7.9%", "+8% to +9.9%",
        "+10% to +14.9%", "\u2265 +15%"
      ]
    },
    {
      id: "fertility",
      title: "Early childbearing (women)",
      anchor: "Among women from comparison schools, approximately <strong>40%</strong> had their first child before age 20.",
      prompt: "How many percentage points higher or lower do you think the share who had their first child before age 20 was among those who received the 0.3 SD reading boost, on average across settings?\n\n<strong>A negative number means a lower rate of early childbearing; a positive number means a higher rate.</strong>",
      unit: "percentage-point difference",
      bins: [
        "\u2264 \u221215.1", "\u221215 to \u221210.1", "\u221210 to \u22128.1",
        "\u22128 to \u22126.1", "\u22126 to \u22124.1", "\u22124 to \u22122.1", "\u22122 to \u22120.1",
        "0 to +1.9", "+2 to +3.9", "+4 to +5.9", "\u2265 +6"
      ]
    }
  ],

  policyRelevance: {
    prompt: "What is the smallest change in earnings you would consider substantively important, large enough to represent a meaningful improvement in people\u2019s economic lives? (This is not about your predictions. We are asking about the threshold below which you would consider the effect too small to matter.)",
    unit: "percentage change in earnings",
    label: "Minimum required percentage change in earnings"
  },

  /* ── Module D: heterogeneity & non-linearity ───────── */
  heteroPreamble: "So far you have predicted the <strong>average</strong> effect of a 0.3 SD reading gain on adult outcomes, pooling across all settings.\n\nIn practice, these programmes have been run in countries like <strong>Ghana, India, Kenya, Liberia, Pakistan, and Uganda</strong>, places that differ in their education systems, labour markets, and economic conditions. Even if the initial reading gain is the same (0.3 SD), the long-run effects may not be.\n\nWe now want to know how much you think the <strong>true effect varies across countries</strong>. This is not about your uncertainty in the average. It is about whether you think the real effect is roughly the same everywhere, or whether it is genuinely larger in some settings and smaller in others.\n\nWe will ask about two outcomes: <strong>lower-secondary completion</strong> and <strong>earnings</strong>.",

  moduleD: {
    hetero: [
      {
        id: "hetero_completion",
        title: "Heterogeneity in completion effects",
        preamble: "First think about the effect on <strong>lower-secondary completion</strong>.\n\nWhat is the difference between the setting where the effect on completion is largest and the setting where it is smallest?",
        example: "For example, if the reading gain increases completion by 8 pp in the best setting and 2 pp in the worst, the range would be 6 pp.",
        prompt: "As before, spreading your points across bins reflects your uncertainty.",
        unit: "percentage-point difference",
        bins: [
          "0 to 1.9", "2 to 3.9", "4 to 5.9", "6 to 7.9", "8 to 9.9",
          "10 to 14.9", "15 to 19.9", "\u2265 20"
        ]
      },
      {
        id: "hetero_earnings",
        title: "Heterogeneity in earnings effects",
        preamble: "Now think about the effect on <strong>earnings</strong>.\n\nWhat is the difference in the percentage change in earnings between the setting where the effect is largest and where it is smallest?",
        example: "For example, if earnings increase by 12% in the best setting and 2% in the worst, the range would be 10 percentage points.",
        prompt: "As before, spreading your points across bins reflects your uncertainty.",
        unit: "percentage-point difference",
        bins: [
          "0 to 1.9", "2 to 3.9", "4 to 5.9", "6 to 7.9", "8 to 9.9",
          "10 to 14.9", "15 to 19.9", "\u2265 20"
        ]
      }
    ],
    nonLinearity: {
      promptTemplate: "{PERSONALISED_OPENING}\n\nNow imagine an intervention that produced twice that gain, about 10 extra correct words per minute (a 0.6 SD gain).\n\nWould you expect the long-run effects on adult earnings to be:",
      options: [
        { value: "more_than_doubled", label: "More than doubled (bigger initial gains lead to disproportionately bigger long-run effects)" },
        { value: "roughly_doubled", label: "Roughly doubled (long-run effects scale proportionally with the reading gain)" },
        { value: "less_than_doubled", label: "Less than doubled (there are diminishing returns: twice the reading gain does not produce twice the long-run effect)" }
      ],
      followUp: "Please briefly explain your reasoning (optional):"
    }
  }
};
