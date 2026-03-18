import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Atom, Calculator, FlaskConical } from "lucide-react";

interface Formula {
  label?: string;
  expr: string;
}

interface Chapter {
  id: string;
  title: string;
  formulas: Formula[];
}

const mathsChapters: Chapter[] = [
  {
    id: "limits",
    title: "Limits",
    formulas: [
      { expr: "lim(x→0) sin x / x = 1" },
      { expr: "lim(x→0) tan x / x = 1" },
      { expr: "lim(x→0) (1 − cos x) / x² = 1/2" },
      { expr: "lim(x→0) (eˣ − 1) / x = 1" },
      { expr: "lim(x→0) (aˣ − 1) / x = ln a" },
      { expr: "lim(x→0) ln(1 + x) / x = 1" },
      { expr: "lim(x→∞) (1 + 1/x)ˣ = e" },
      {
        label: "L'Hôpital's Rule",
        expr: "lim f(x)/g(x) = lim f'(x)/g'(x)  [0/0 or ∞/∞ form]",
      },
    ],
  },
  {
    id: "differentiation",
    title: "Differentiation",
    formulas: [
      { expr: "d/dx (xⁿ) = nxⁿ⁻¹" },
      { expr: "d/dx (eˣ) = eˣ" },
      { expr: "d/dx (aˣ) = aˣ ln a" },
      { expr: "d/dx (ln x) = 1/x" },
      { expr: "d/dx (sin x) = cos x" },
      { expr: "d/dx (cos x) = −sin x" },
      { expr: "d/dx (tan x) = sec²x" },
      { expr: "d/dx (cot x) = −csc²x" },
      { expr: "d/dx (sec x) = sec x · tan x" },
      { expr: "d/dx (csc x) = −csc x · cot x" },
      { expr: "d/dx (sin⁻¹x) = 1 / √(1 − x²)" },
      { expr: "d/dx (cos⁻¹x) = −1 / √(1 − x²)" },
      { expr: "d/dx (tan⁻¹x) = 1 / (1 + x²)" },
      { label: "Product Rule", expr: "d/dx (uv) = u'v + uv'" },
      { label: "Quotient Rule", expr: "d/dx (u/v) = (u'v − uv') / v²" },
      { label: "Chain Rule", expr: "d/dx [f(g(x))] = f'(g(x)) · g'(x)" },
    ],
  },
  {
    id: "integration",
    title: "Integration",
    formulas: [
      { expr: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)" },
      { expr: "∫ 1/x dx = ln|x| + C" },
      { expr: "∫ eˣ dx = eˣ + C" },
      { expr: "∫ aˣ dx = aˣ / ln a + C" },
      { expr: "∫ sin x dx = −cos x + C" },
      { expr: "∫ cos x dx = sin x + C" },
      { expr: "∫ tan x dx = ln|sec x| + C" },
      { expr: "∫ cot x dx = ln|sin x| + C" },
      { expr: "∫ sec²x dx = tan x + C" },
      { expr: "∫ csc²x dx = −cot x + C" },
      { expr: "∫ 1/√(1−x²) dx = sin⁻¹x + C" },
      { expr: "∫ 1/(1+x²) dx = tan⁻¹x + C" },
      { label: "Integration by Parts (ILATE)", expr: "∫ u dv = uv − ∫ v du" },
      { expr: "∫ 1/(x²−a²) dx = 1/(2a) · ln|(x−a)/(x+a)| + C" },
      { expr: "∫ √(a²−x²) dx = (x/2)√(a²−x²) + (a²/2)sin⁻¹(x/a) + C" },
    ],
  },
  {
    id: "trigonometry",
    title: "Trigonometry",
    formulas: [
      { label: "Pythagorean Identities", expr: "sin²θ + cos²θ = 1" },
      { expr: "1 + tan²θ = sec²θ" },
      { expr: "1 + cot²θ = csc²θ" },
      { label: "Addition Formulas", expr: "sin(A±B) = sinA cosB ± cosA sinB" },
      { expr: "cos(A±B) = cosA cosB ∓ sinA sinB" },
      { expr: "tan(A±B) = (tanA ± tanB) / (1 ∓ tanA tanB)" },
      { label: "Double Angle", expr: "sin 2A = 2 sinA cosA = 2tanA/(1+tan²A)" },
      { expr: "cos 2A = cos²A − sin²A = 1 − 2sin²A = 2cos²A − 1" },
      { expr: "tan 2A = 2tanA / (1 − tan²A)" },
      { label: "Triple Angle", expr: "sin 3A = 3sinA − 4sin³A" },
      { expr: "cos 3A = 4cos³A − 3cosA" },
      {
        label: "Sum-to-Product",
        expr: "sinC + sinD = 2 sin((C+D)/2) cos((C−D)/2)",
      },
      { expr: "cosC + cosD = 2 cos((C+D)/2) cos((C−D)/2)" },
      { label: "Product-to-Sum", expr: "2 sinA cosB = sin(A+B) + sin(A−B)" },
    ],
  },
  {
    id: "matrices",
    title: "Matrices",
    formulas: [
      { expr: "(AB)ᵀ = BᵀAᵀ" },
      { expr: "(AB)⁻¹ = B⁻¹A⁻¹" },
      { expr: "det(AB) = det(A) · det(B)" },
      { label: "2×2 Determinant", expr: "det([[a,b],[c,d]]) = ad − bc" },
      { label: "2×2 Inverse", expr: "A⁻¹ = (1/det A) · [[d,−b],[−c,a]]" },
      {
        label: "Cayley-Hamilton",
        expr: "Every matrix satisfies its own characteristic equation",
      },
      { expr: "Rank = number of non-zero rows in row echelon form" },
      { label: "Homogeneous AX=0", expr: "Non-trivial solution ⟺ det(A) = 0" },
      { label: "Eigenvalue", expr: "det(A − λI) = 0" },
      { expr: "Trace = Σ diagonal elements = Σ eigenvalues" },
    ],
  },
];

const physicsChapters: Chapter[] = [
  {
    id: "kinematics",
    title: "Kinematics",
    formulas: [
      { expr: "v = u + at" },
      { expr: "s = ut + ½at²" },
      { expr: "v² = u² + 2as" },
      { label: "nth Second", expr: "sₙ = u + a(2n−1)/2" },
      { label: "Projectile Range", expr: "R = u²sin 2θ / g" },
      { label: "Max Height", expr: "H = u²sin²θ / (2g)" },
      { label: "Time of Flight", expr: "T = 2u sinθ / g" },
      { label: "Relative Velocity", expr: "v_AB = v_A − v_B" },
    ],
  },
  {
    id: "nlm",
    title: "Newton's Laws of Motion (NLM)",
    formulas: [
      { label: "Newton's 2nd Law", expr: "F = ma" },
      { label: "Impulse", expr: "J = FΔt = Δp" },
      {
        label: "Momentum",
        expr: "p = mv;  p_initial = p_final (conservation)",
      },
      { label: "Static Friction", expr: "f_s ≤ μ_s N" },
      { label: "Kinetic Friction", expr: "f_k = μ_k N" },
      { label: "Atwood Machine (a)", expr: "a = (m₁−m₂)g / (m₁+m₂)" },
      { label: "Atwood Machine (T)", expr: "T = 2m₁m₂g / (m₁+m₂)" },
      { label: "Hooke's Law", expr: "F = −kx" },
      { label: "Pseudo Force", expr: "F_pseudo = −ma_frame" },
    ],
  },
  {
    id: "wpe",
    title: "Work, Power & Energy",
    formulas: [
      { label: "Work", expr: "W = F · d · cosθ = F⃗ · d⃗" },
      { label: "Kinetic Energy", expr: "KE = ½mv²" },
      { label: "Gravitational PE", expr: "PE = mgh" },
      { label: "Spring PE", expr: "PE = ½kx²" },
      { label: "Work-Energy Theorem", expr: "W_net = ΔKE" },
      { label: "Power", expr: "P = W/t = F · v" },
      {
        label: "Conservation",
        expr: "KE + PE = constant  (conservative forces)",
      },
      { label: "Escape Velocity", expr: "v_e = √(2gR) = √(2GM/R)" },
    ],
  },
  {
    id: "rotation",
    title: "Rotation",
    formulas: [
      { label: "Torque", expr: "τ = r × F = Iα" },
      { label: "Angular Momentum", expr: "L = Iω;   τ = dL/dt" },
      { label: "MOI", expr: "I = Σmr²" },
      { label: "Parallel Axis Theorem", expr: "I = I_cm + Md²" },
      { label: "Perpendicular Axis (lamina)", expr: "I_z = I_x + I_y" },
      { label: "Rotational KE", expr: "KE_rot = ½Iω²" },
      { label: "Rolling (no slip)", expr: "v = Rω;   KE_total = ½mv² + ½Iω²" },
      { label: "Solid Sphere", expr: "I = 2/5 MR²" },
      { label: "Hollow Sphere", expr: "I = 2/3 MR²" },
      { label: "Disc (center)", expr: "I = ½MR²" },
      { label: "Rod (center)", expr: "I = ML²/12" },
    ],
  },
  {
    id: "modern-physics",
    title: "Modern Physics",
    formulas: [
      { label: "Planck's Equation", expr: "E = hf = hc/λ" },
      { label: "de Broglie", expr: "λ = h/p = h/(mv)" },
      {
        label: "Photoelectric Effect",
        expr: "KE_max = hf − φ  (φ = work function)",
      },
      { label: "Stopping Potential", expr: "eV₀ = KE_max" },
      { label: "Bohr Radius", expr: "rₙ = n²a₀  (a₀ = 0.529 Å)" },
      { label: "Bohr Energy", expr: "Eₙ = −13.6 / n²  eV" },
      { label: "Transition Energy", expr: "ΔE = 13.6 (1/n₁² − 1/n₂²)  eV" },
      { label: "Radioactive Decay", expr: "N = N₀ e^(−λt);   t½ = 0.693/λ" },
      { label: "Mass-Energy", expr: "E = mc²" },
      { label: "Binding Energy", expr: "BE = [Zm_p + Nm_n − M_nucleus] · c²" },
    ],
  },
];

const chemistryChapters: Chapter[] = [
  {
    id: "mole-concept",
    title: "Mole Concept",
    formulas: [
      { label: "Moles", expr: "n = m / M  (mass / molar mass)" },
      { label: "Number of Particles", expr: "N = n × Nₐ  (Nₐ = 6.022 × 10²³)" },
      { label: "Molar Volume at STP", expr: "1 mol gas = 22.4 L" },
      { label: "Molarity", expr: "M = n_solute / V_solution (L)" },
      { label: "Molality", expr: "m = n_solute / mass_solvent (kg)" },
      { label: "Mole Fraction", expr: "χ_A = n_A / (n_A + n_B)" },
      { label: "Normality", expr: "N = n × equivalents / V (L)" },
      { label: "Dilution", expr: "M₁V₁ = M₂V₂" },
      {
        label: "Molecular Formula",
        expr: "Molecular = n × Empirical  (n = M/E)",
      },
    ],
  },
  {
    id: "thermodynamics",
    title: "Thermodynamics",
    formulas: [
      { label: "First Law (IUPAC)", expr: "ΔU = q + w;   w = −PΔV" },
      { label: "Enthalpy", expr: "H = U + PV;   ΔH = ΔU + Δnᵍ RT" },
      {
        label: "Hess's Law",
        expr: "ΔH_rxn = Σ ΔH_f(products) − Σ ΔH_f(reactants)",
      },
      {
        label: "Entropy",
        expr: "ΔS = q_rev / T;   ΔS_universe > 0 (spontaneous)",
      },
      { label: "Gibbs Energy", expr: "G = H − TS;   ΔG = ΔH − TΔS" },
      { label: "Spontaneity", expr: "ΔG < 0 → spontaneous" },
      {
        label: "Gibbs & Equilibrium",
        expr: "ΔG° = −RT ln K;   ΔG = ΔG° + RT ln Q",
      },
      { label: "Ideal Gas", expr: "Cₚ − Cᵥ = R;   γ = Cₚ/Cᵥ" },
    ],
  },
  {
    id: "kinetics",
    title: "Chemical Kinetics",
    formulas: [
      { label: "Rate Law", expr: "Rate = k[A]ᵐ[B]ⁿ" },
      { label: "Zero Order", expr: "[A] = [A]₀ − kt;   t½ = [A]₀/(2k)" },
      { label: "First Order", expr: "[A] = [A]₀ e^(−kt);   t½ = 0.693/k" },
      { label: "First Order (k)", expr: "k = (2.303/t) log([A]₀/[A])" },
      { label: "Second Order", expr: "1/[A] = 1/[A]₀ + kt;   t½ = 1/(k[A]₀)" },
      { label: "Arrhenius", expr: "k = A e^(−Eₐ/RT)" },
      {
        label: "Arrhenius (two temps)",
        expr: "ln(k₂/k₁) = (Eₐ/R)(1/T₁ − 1/T₂)",
      },
      {
        label: "Activation Energy Graph",
        expr: "Slope = −Eₐ/R  in  ln k vs 1/T",
      },
    ],
  },
  {
    id: "electrochemistry",
    title: "Electrochemistry",
    formulas: [
      { label: "Cell EMF", expr: "E_cell = E_cathode − E_anode" },
      { label: "Nernst Equation", expr: "E = E° − (RT/nF) ln Q" },
      { label: "Nernst at 25°C", expr: "E = E° − (0.0591/n) log Q" },
      { label: "Gibbs & EMF", expr: "ΔG° = −nFE°;   ΔG° = −RT ln K" },
      {
        label: "Faraday's Law",
        expr: "m = (M × I × t) / (n × F);   F = 96500 C/mol",
      },
      { label: "Kohlrausch's Law", expr: "Λ°_m = ν₊λ°₊ + ν₋λ°₋" },
      { label: "Conductance", expr: "G = 1/R;   κ = G × l/A" },
      { label: "Molar Conductivity", expr: "Λ_m = (κ × 1000) / M" },
    ],
  },
];

const subjectColors = {
  maths: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    header: "bg-blue-600",
    badge: "bg-blue-100 text-blue-700",
    trigger: "hover:bg-blue-50",
    labelColor: "text-blue-700",
    accent: "border-l-blue-400",
  },
  physics: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    header: "bg-orange-600",
    badge: "bg-orange-100 text-orange-700",
    trigger: "hover:bg-orange-50",
    labelColor: "text-orange-700",
    accent: "border-l-orange-400",
  },
  chemistry: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    header: "bg-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    trigger: "hover:bg-emerald-50",
    labelColor: "text-emerald-700",
    accent: "border-l-emerald-400",
  },
};

function FormulaList({
  formulas,
  colors,
}: { formulas: Formula[]; colors: typeof subjectColors.maths }) {
  return (
    <div className="space-y-2 py-1">
      {formulas.map((f) => (
        <div key={f.expr} className={`border-l-2 pl-3 py-0.5 ${colors.accent}`}>
          {f.label && (
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${colors.labelColor} block mb-0.5`}
            >
              {f.label}
            </span>
          )}
          <code className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded block leading-relaxed">
            {f.expr}
          </code>
        </div>
      ))}
    </div>
  );
}

function ChapterAccordion({
  chapters,
  colors,
  prefix,
}: {
  chapters: Chapter[];
  colors: typeof subjectColors.maths;
  prefix: string;
}) {
  return (
    <Accordion type="multiple" className="space-y-2">
      {chapters.map((chapter, idx) => (
        <AccordionItem
          key={chapter.id}
          value={chapter.id}
          className={`border rounded-lg overflow-hidden ${colors.border}`}
          data-ocid={`formula.${prefix}.item.${idx + 1}`}
        >
          <AccordionTrigger
            className={`px-4 py-3 font-semibold text-sm text-left ${colors.trigger} [&>svg]:shrink-0`}
          >
            <span className="flex items-center gap-2">
              {chapter.title}
              <Badge
                variant="outline"
                className={`text-xs font-normal ${colors.badge} border-0 ml-1`}
              >
                {chapter.formulas.length} formulas
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className={`px-4 pb-4 pt-2 ${colors.bg}`}>
            <FormulaList formulas={chapter.formulas} colors={colors} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function FormulaSheetPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          JEE Formula Sheet
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Quick-reference formulas for Maths, Physics &amp; Chemistry — all
          chapters covered.
        </p>
      </div>

      <Tabs defaultValue="maths" data-ocid="formula.tab">
        <TabsList className="w-full mb-6 h-auto p-1 grid grid-cols-3">
          <TabsTrigger
            value="maths"
            className="flex items-center gap-2 py-2.5 text-sm"
            data-ocid="formula.maths.tab"
          >
            <Calculator className="w-4 h-4" />
            <span>Maths</span>
          </TabsTrigger>
          <TabsTrigger
            value="physics"
            className="flex items-center gap-2 py-2.5 text-sm"
            data-ocid="formula.physics.tab"
          >
            <Atom className="w-4 h-4" />
            <span>Physics</span>
          </TabsTrigger>
          <TabsTrigger
            value="chemistry"
            className="flex items-center gap-2 py-2.5 text-sm"
            data-ocid="formula.chemistry.tab"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Chemistry</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="maths">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg">
              <Calculator className="w-4 h-4" />
              <span className="font-semibold text-sm">Mathematics</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {mathsChapters.length} chapters
            </span>
          </div>
          <ScrollArea className="h-[calc(100vh-280px)] pr-1">
            <ChapterAccordion
              chapters={mathsChapters}
              colors={subjectColors.maths}
              prefix="maths"
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="physics">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-lg">
              <Atom className="w-4 h-4" />
              <span className="font-semibold text-sm">Physics</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {physicsChapters.length} chapters
            </span>
          </div>
          <ScrollArea className="h-[calc(100vh-280px)] pr-1">
            <ChapterAccordion
              chapters={physicsChapters}
              colors={subjectColors.physics}
              prefix="physics"
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chemistry">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg">
              <FlaskConical className="w-4 h-4" />
              <span className="font-semibold text-sm">Chemistry</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {chemistryChapters.length} chapters
            </span>
          </div>
          <ScrollArea className="h-[calc(100vh-280px)] pr-1">
            <ChapterAccordion
              chapters={chemistryChapters}
              colors={subjectColors.chemistry}
              prefix="chemistry"
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
