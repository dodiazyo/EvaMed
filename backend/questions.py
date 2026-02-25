"""
Banco de preguntas para evaluación psicológica general (aplicable a cualquier perfil laboral).

Áreas y pesos:
  personalidad  → 35%  (subdims: estabilidad, dominancia, consciencia, atencion, perfeccionismo, tension)
  integridad    → 25%  (subdims: honestidad, resistencia, transparencia)
  emocional     → 20%  (subdims: control, empatia, estres)
  aptitud       → 20%  (subdims: decision, autoridad, resolucion)

Opciones siempre 3: [De acuerdo / A veces o Depende / En desacuerdo]
Puntuación: [2, 1, 0] o [0, 1, 2] si la pregunta está invertida.
"""

AREAS = {
    "personalidad": {
        "name": "Personalidad",
        "weight": 0.35,
        "dimensions": {
            "estabilidad":    "Estabilidad Emocional",
            "dominancia":     "Dominancia",
            "consciencia":    "Consciencia",
            "atencion":       "Atención y Concentración",
            "perfeccionismo": "Perfeccionismo",
            "tension":        "Manejo de Tensión",
        },
    },
    "integridad": {
        "name": "Integridad y Honestidad",
        "weight": 0.25,
        "dimensions": {
            "honestidad":   "Honestidad",
            "resistencia":  "Resistencia a la Corrupción",
            "transparencia":"Transparencia",
        },
    },
    "emocional": {
        "name": "Inteligencia Emocional",
        "weight": 0.20,
        "dimensions": {
            "control": "Control Emocional",
            "empatia": "Empatía",
            "estres":  "Manejo del Estrés",
        },
    },
    "aptitud": {
        "name": "Aptitud Profesional",
        "weight": 0.20,
        "dimensions": {
            "decision":   "Decisión bajo Presión",
            "autoridad":  "Respeto a la Autoridad",
            "resolucion": "Resolución de Problemas",
        },
    },
}

OPTIONS = ["De acuerdo", "A veces / Depende", "En desacuerdo"]

QUESTIONS = [
    # ─────────────── PERSONALIDAD ───────────────────────────────────────────
    # Estabilidad emocional (7 preguntas)
    {
        "id": 1, "area": "personalidad", "dimension": "estabilidad",
        "text": "Me considero una persona emocionalmente estable, incluso en situaciones difíciles.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 2, "area": "personalidad", "dimension": "estabilidad",
        "text": "Cuando algo sale mal en el trabajo, logro mantener la calma sin mayor dificultad.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 3, "area": "personalidad", "dimension": "estabilidad",
        "text": "Me cuesta mucho superar las críticas o llamadas de atención de mis superiores.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 4, "area": "personalidad", "dimension": "estabilidad",
        "text": "Soy capaz de separar mis problemas personales de mis responsabilidades laborales.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 5, "area": "personalidad", "dimension": "estabilidad",
        "text": "Con frecuencia me siento ansioso o preocupado sin razón clara.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 6, "area": "personalidad", "dimension": "estabilidad",
        "text": "Cuando enfrento problemas complejos, siento que puedo encontrar soluciones de manera tranquila.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 7, "area": "personalidad", "dimension": "estabilidad",
        "text": "Los cambios inesperados en mi rutina me generan un nivel alto de estrés.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },

    # Dominancia (6 preguntas)
    {
        "id": 8, "area": "personalidad", "dimension": "dominancia",
        "text": "Me siento cómodo tomando decisiones cuando nadie más quiere hacerlo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 9, "area": "personalidad", "dimension": "dominancia",
        "text": "En situaciones de grupo, generalmente tomo la iniciativa.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 10, "area": "personalidad", "dimension": "dominancia",
        "text": "Prefiero seguir instrucciones que proponer ideas propias.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.8,
    },
    {
        "id": 11, "area": "personalidad", "dimension": "dominancia",
        "text": "Si noto que un compañero hace algo incorrecto, no dudo en señalárselo con respeto.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 12, "area": "personalidad", "dimension": "dominancia",
        "text": "Me resulta difícil decir 'no' cuando alguien me pide algo que considero inapropiado.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 13, "area": "personalidad", "dimension": "dominancia",
        "text": "Considero que tengo una personalidad firme y decidida.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # Consciencia (6 preguntas)
    {
        "id": 14, "area": "personalidad", "dimension": "consciencia",
        "text": "Siempre cumplo mis compromisos y obligaciones, aunque me cueste esfuerzo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 15, "area": "personalidad", "dimension": "consciencia",
        "text": "Soy muy organizado con mis tareas y responsabilidades.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 16, "area": "personalidad", "dimension": "consciencia",
        "text": "A veces postergo obligaciones importantes por hacer cosas que me resultan más agradables.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 17, "area": "personalidad", "dimension": "consciencia",
        "text": "Me aseguro de entender perfectamente mis funciones antes de comenzar cualquier tarea.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 18, "area": "personalidad", "dimension": "consciencia",
        "text": "Cuando cometo un error, lo reconozco y busco corregirlo de inmediato.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 19, "area": "personalidad", "dimension": "consciencia",
        "text": "Me cuesta seguir normas o procedimientos cuando creo que no son necesarios.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },

    # Atención y Concentración (5 preguntas)
    {
        "id": 20, "area": "personalidad", "dimension": "atencion",
        "text": "Me concentro fácilmente en una tarea incluso cuando hay distracciones en el ambiente.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 21, "area": "personalidad", "dimension": "atencion",
        "text": "Con frecuencia me distraigo con facilidad cuando realizo tareas repetitivas o de atención sostenida.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 22, "area": "personalidad", "dimension": "atencion",
        "text": "Noto rápidamente cuando algo en mi entorno laboral está fuera de lo normal.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 23, "area": "personalidad", "dimension": "atencion",
        "text": "Me resulta sencillo mantener el foco durante períodos prolongados de trabajo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 0.8,
    },
    {
        "id": 24, "area": "personalidad", "dimension": "atencion",
        "text": "Suelo pasar por alto detalles importantes cuando tengo varias tareas al mismo tiempo.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },

    # Perfeccionismo (5 preguntas)
    {
        "id": 25, "area": "personalidad", "dimension": "perfeccionismo",
        "text": "Me molesta cuando algo no se hace exactamente como debe hacerse.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 0.9,
    },
    {
        "id": 26, "area": "personalidad", "dimension": "perfeccionismo",
        "text": "Reviso mi trabajo más de una vez para asegurarme de que esté correcto.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 27, "area": "personalidad", "dimension": "perfeccionismo",
        "text": "Acepto que 'suficientemente bueno' es válido aunque se pueda mejorar.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.8,
    },
    {
        "id": 28, "area": "personalidad", "dimension": "perfeccionismo",
        "text": "Presto mucha atención a los detalles en las tareas que realizo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 29, "area": "personalidad", "dimension": "perfeccionismo",
        "text": "Sigo los procedimientos al pie de la letra incluso cuando nadie me supervisa.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # Tensión (5 preguntas)
    {
        "id": 30, "area": "personalidad", "dimension": "tension",
        "text": "Cuando hay mucha presión en el trabajo, mi rendimiento no se ve afectado.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 31, "area": "personalidad", "dimension": "tension",
        "text": "Me siento tenso o crispado con mucha frecuencia durante la jornada laboral.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 32, "area": "personalidad", "dimension": "tension",
        "text": "Puedo trabajar de manera eficiente durante períodos prolongados sin descanso.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 33, "area": "personalidad", "dimension": "tension",
        "text": "Cuando recibo múltiples tareas al mismo tiempo, me confundo fácilmente.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 34, "area": "personalidad", "dimension": "tension",
        "text": "Recupero la calma rápidamente después de una situación de alto estrés.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # ─────────────── INTEGRIDAD / HONESTIDAD ────────────────────────────────
    # Honestidad (9 preguntas)
    {
        "id": 35, "area": "integridad", "dimension": "honestidad",
        "text": "Siempre digo la verdad, aunque esto pueda traerme consecuencias negativas.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 36, "area": "integridad", "dimension": "honestidad",
        "text": "Si encontrara dinero o pertenencias ajenas en mi área de trabajo, las entregaría de inmediato.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 37, "area": "integridad", "dimension": "honestidad",
        "text": "Hay situaciones en las que una 'mentira piadosa' está justificada en el trabajo.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.9,
    },
    {
        "id": 38, "area": "integridad", "dimension": "honestidad",
        "text": "He hecho cosas en el pasado que, si mis superiores supieran, podrían afectar mi imagen.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 39, "area": "integridad", "dimension": "honestidad",
        "text": "Informo situaciones irregulares de inmediato, aunque implique dificultades para otros.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 40, "area": "integridad", "dimension": "honestidad",
        "text": "A veces es mejor no decir toda la verdad para evitar conflictos innecesarios.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.8,
    },
    {
        "id": 41, "area": "integridad", "dimension": "honestidad",
        "text": "Si cometo un error que nadie vio, lo reporto igualmente a quien corresponda.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 42, "area": "integridad", "dimension": "honestidad",
        "text": "Considero que soy completamente honesto en todas mis relaciones laborales.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 43, "area": "integridad", "dimension": "honestidad",
        "text": "He llegado tarde o faltado al trabajo y lo he justificado con excusas que no eran ciertas.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },

    # Resistencia a la corrupción (9 preguntas)
    {
        "id": 44, "area": "integridad", "dimension": "resistencia",
        "text": "Si alguien me ofreciera un beneficio personal para que omitiera una irregularidad, lo rechazaría sin dudar.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 45, "area": "integridad", "dimension": "resistencia",
        "text": "Bajo ninguna circunstancia aceptaría un trato especial a cambio de saltarme una norma.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 46, "area": "integridad", "dimension": "resistencia",
        "text": "Si un compañero me pide que lo encubra en algo incorrecto, me negaría aunque afecte nuestra relación.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 47, "area": "integridad", "dimension": "resistencia",
        "text": "Si nadie se enteraría, creo que podría aceptar un pequeño beneficio a cambio de una pequeña omisión.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 48, "area": "integridad", "dimension": "resistencia",
        "text": "Las relaciones personales o de amistad no me influyen para tomar decisiones contrarias al reglamento.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 49, "area": "integridad", "dimension": "resistencia",
        "text": "Si una persona de confianza me pide que haga una excepción a las normas, soy capaz de negarme.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 50, "area": "integridad", "dimension": "resistencia",
        "text": "Creo que todo el mundo tiene su precio y que nadie es completamente íntegro.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.8,
    },
    {
        "id": 51, "area": "integridad", "dimension": "resistencia",
        "text": "Denunciaría a un superior si detectara que está involucrado en actos deshonestos.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 52, "area": "integridad", "dimension": "resistencia",
        "text": "Mis principios son más importantes que los beneficios económicos que pudiera obtener actuando mal.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # Transparencia (7 preguntas)
    {
        "id": 53, "area": "integridad", "dimension": "transparencia",
        "text": "Siempre informo a mis superiores sobre todo lo relevante que ocurre en mi jornada de trabajo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 54, "area": "integridad", "dimension": "transparencia",
        "text": "No me cuesta reconocer cuando he cometido un error delante de mis compañeros o superiores.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 55, "area": "integridad", "dimension": "transparencia",
        "text": "Prefiero no mencionar ciertos incidentes para evitar problemas o complicaciones innecesarias.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 56, "area": "integridad", "dimension": "transparencia",
        "text": "Llevo un registro claro y preciso de las actividades y eventos relevantes de mi jornada.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 57, "area": "integridad", "dimension": "transparencia",
        "text": "Si alguien me pide información confidencial de la empresa, me niego aunque me presionen.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 58, "area": "integridad", "dimension": "transparencia",
        "text": "Creo que a veces es mejor guardarse información para no generar conflictos innecesarios.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.9,
    },
    {
        "id": 59, "area": "integridad", "dimension": "transparencia",
        "text": "Mis compañeros saben que pueden confiar en que seré honesto con ellos en todo momento.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # ─────────────── INTELIGENCIA EMOCIONAL ─────────────────────────────────
    # Control emocional (7 preguntas)
    {
        "id": 60, "area": "emocional", "dimension": "control",
        "text": "Cuando alguien me insulta o provoca, logro mantener la compostura.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 61, "area": "emocional", "dimension": "control",
        "text": "Me cuesta controlar mi enojo cuando me tratan de forma injusta.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 62, "area": "emocional", "dimension": "control",
        "text": "Puedo trabajar de manera profesional con personas que no me caen bien.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 63, "area": "emocional", "dimension": "control",
        "text": "Cuando estoy muy frustrado, me es difícil seguir concentrado en mis tareas.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 64, "area": "emocional", "dimension": "control",
        "text": "Soy capaz de identificar cuando mis emociones están afectando mi rendimiento y hago algo al respecto.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 65, "area": "emocional", "dimension": "control",
        "text": "He tenido conflictos laborales por no controlar mis reacciones emocionales.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 66, "area": "emocional", "dimension": "control",
        "text": "Ante una discusión, escucho antes de responder.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # Empatía (6 preguntas)
    {
        "id": 67, "area": "emocional", "dimension": "empatia",
        "text": "Me doy cuenta fácilmente cuando alguien a mi alrededor está pasando por un mal momento.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 68, "area": "emocional", "dimension": "empatia",
        "text": "Me cuesta ponerme en el lugar de los demás cuando tienen problemas que no entiendo.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 69, "area": "emocional", "dimension": "empatia",
        "text": "Trato a todas las personas con respeto independientemente de su cargo o condición.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 70, "area": "emocional", "dimension": "empatia",
        "text": "Cuando alguien expresa una queja o inconformidad, trato de entender su perspectiva antes de responder.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 71, "area": "emocional", "dimension": "empatia",
        "text": "Me resulta indiferente cómo se sientan mis compañeros siempre que hagan su trabajo.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.9,
    },
    {
        "id": 72, "area": "emocional", "dimension": "empatia",
        "text": "Soy hábil para ayudar a resolver conflictos entre compañeros de trabajo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # Manejo del estrés (6 preguntas)
    {
        "id": 73, "area": "emocional", "dimension": "estres",
        "text": "Tengo estrategias personales que me ayudan a manejar el estrés del trabajo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 74, "area": "emocional", "dimension": "estres",
        "text": "El estrés prolongado afecta significativamente mi calidad de vida.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.9,
    },
    {
        "id": 75, "area": "emocional", "dimension": "estres",
        "text": "Puedo descansar mentalmente después de una jornada intensa sin que me queden pensamientos negativos.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 76, "area": "emocional", "dimension": "estres",
        "text": "Cuando el trabajo se acumula, me resulta difícil priorizar qué hacer primero.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 77, "area": "emocional", "dimension": "estres",
        "text": "Cuido mi salud física y mental como parte de mi desempeño profesional.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 78, "area": "emocional", "dimension": "estres",
        "text": "Dormir mal o tener problemas personales no me impide rendir bien en el trabajo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 0.9,
    },

    # ─────────────── APTITUD PROFESIONAL ────────────────────────────────────
    # Decisión bajo presión (8 preguntas)
    {
        "id": 79, "area": "aptitud", "dimension": "decision",
        "text": "En situaciones de urgencia, tomo decisiones rápidas y claras.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 80, "area": "aptitud", "dimension": "decision",
        "text": "Me bloqueo cuando debo decidir rápido en una situación que no había anticipado.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 81, "area": "aptitud", "dimension": "decision",
        "text": "Prefiero esperar instrucciones antes de tomar cualquier iniciativa propia.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.8,
    },
    {
        "id": 82, "area": "aptitud", "dimension": "decision",
        "text": "He manejado situaciones complicadas antes y me sentí capaz de resolverlas.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 83, "area": "aptitud", "dimension": "decision",
        "text": "Soy capaz de evaluar las opciones disponibles rápidamente y elegir la más adecuada.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 84, "area": "aptitud", "dimension": "decision",
        "text": "Cuando hay ambigüedad en las instrucciones, actúo con precaución y sentido común.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 85, "area": "aptitud", "dimension": "decision",
        "text": "Mis decisiones bajo presión suelen ser cuestionadas o resultan incorrectas.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 86, "area": "aptitud", "dimension": "decision",
        "text": "Me adapto fácilmente cuando los planes cambian de forma repentina.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },

    # Respeto a la autoridad (6 preguntas)
    {
        "id": 87, "area": "aptitud", "dimension": "autoridad",
        "text": "Sigo las instrucciones de mis superiores aunque no esté completamente de acuerdo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 88, "area": "aptitud", "dimension": "autoridad",
        "text": "He tenido enfrentamientos o conflictos serios con jefes o supervisores en trabajos anteriores.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 89, "area": "aptitud", "dimension": "autoridad",
        "text": "Respeto la jerarquía institucional porque entiendo que es necesaria para el funcionamiento del equipo.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 90, "area": "aptitud", "dimension": "autoridad",
        "text": "Expreso mis desacuerdos de forma respetuosa y por los canales apropiados.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 91, "area": "aptitud", "dimension": "autoridad",
        "text": "Creo que las normas y reglamentos son esenciales y deben respetarse.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 92, "area": "aptitud", "dimension": "autoridad",
        "text": "Me cuesta acatar órdenes cuando no entiendo el motivo detrás de ellas.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.9,
    },

    # Resolución de Problemas (8 preguntas)
    {
        "id": 93, "area": "aptitud", "dimension": "resolucion",
        "text": "Cuando surgen problemas inesperados en el trabajo, busco soluciones de forma ordenada y metódica.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 94, "area": "aptitud", "dimension": "resolucion",
        "text": "Me bloqueo cuando debo encontrar una solución rápida a un problema que no había anticipado.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 95, "area": "aptitud", "dimension": "resolucion",
        "text": "Tengo facilidad para identificar la causa raíz de un problema antes de tomar acción.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 96, "area": "aptitud", "dimension": "resolucion",
        "text": "Prefiero pedir ayuda de inmediato antes de intentar resolver un problema por mis propios medios.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 0.8,
    },
    {
        "id": 97, "area": "aptitud", "dimension": "resolucion",
        "text": "He resuelto situaciones complicadas en el trabajo que inicialmente parecían no tener solución.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 98, "area": "aptitud", "dimension": "resolucion",
        "text": "Cuando un proceso no funciona como debería, propongo alternativas o mejoras.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
    {
        "id": 99, "area": "aptitud", "dimension": "resolucion",
        "text": "Me resulta difícil tomar decisiones cuando no cuento con toda la información necesaria.",
        "options": OPTIONS, "scores": [0, 1, 2], "weight": 1.0,
    },
    {
        "id": 100, "area": "aptitud", "dimension": "resolucion",
        "text": "Adapto mis métodos de trabajo cuando las circunstancias cambian de forma imprevista.",
        "options": OPTIONS, "scores": [2, 1, 0], "weight": 1.0,
    },
]

# Quick lookup by id
QUESTION_BY_ID = {q["id"]: q for q in QUESTIONS}
TOTAL_QUESTIONS = len(QUESTIONS)


def get_question(question_id: int) -> dict | None:
    return QUESTION_BY_ID.get(question_id)


def get_next_unanswered(answered_ids: set[int]) -> dict | None:
    for q in QUESTIONS:
        if q["id"] not in answered_ids:
            return q
    return None


def compute_results(responses: list[dict]) -> dict:
    """
    responses: list of {"question_id": int, "answer_value": int}
    Returns full result dict compatible with ResultOut schema.
    """
    answered = {r["question_id"]: r["answer_value"] for r in responses}

    area_results = {}
    for area_key, area_meta in AREAS.items():
        dim_scores = {}  # dimension_key → {"score": float, "max": float, "name": str}

        for q in QUESTIONS:
            if q["area"] != area_key:
                continue
            val = answered.get(q["id"])
            if val is None:
                continue
            dim = q["dimension"]
            pts = q["scores"][val] * q["weight"]
            max_pts = max(q["scores"]) * q["weight"]
            if dim not in dim_scores:
                dim_scores[dim] = {"score": 0.0, "max": 0.0, "name": area_meta["dimensions"][dim]}
            dim_scores[dim]["score"] += pts
            dim_scores[dim]["max"] += max_pts

        # Calculate dimension percentages
        dim_pcts = {}
        for dk, dv in dim_scores.items():
            pct = round((dv["score"] / dv["max"] * 100) if dv["max"] > 0 else 0, 1)
            dim_pcts[dk] = {"name": dv["name"], "pct": pct}

        # Area overall = average of its dimension percentages
        area_pct = round(sum(d["pct"] for d in dim_pcts.values()) / len(dim_pcts), 1) if dim_pcts else 0.0

        area_results[area_key] = {
            "name": area_meta["name"],
            "key": area_key,
            "pct": area_pct,
            "dimensions": dim_pcts,
            "weight": area_meta["weight"],
        }

    # Overall = weighted sum of area percentages
    overall = round(
        sum(a["pct"] * a["weight"] for a in area_results.values()), 1
    )

    # Verdict logic
    any_area_below_40 = any(a["pct"] < 40 for a in area_results.values())

    if overall >= 70 and not any_area_below_40:
        verdict = "APTO"
        verdict_color = "green"
    elif overall >= 50 and not (any_area_below_40 and overall < 60):
        verdict = "CONDICIONALMENTE APTO"
        verdict_color = "yellow"
    else:
        verdict = "NO APTO"
        verdict_color = "red"

    return {
        "overall_pct": overall,
        "verdict": verdict,
        "verdict_color": verdict_color,
        "areas": [
            {
                "name": v["name"],
                "key": k,
                "pct": v["pct"],
                "dimensions": v["dimensions"],
            }
            for k, v in area_results.items()
        ],
    }
