/** Frase motivadora del día, como en los calendarios de papel de hoja por día. */
export interface Quote {
  text: string;
  author: string;
}

/**
 * Banco de frases. Cada día muestra la siguiente, así que dos días seguidos nunca repiten;
 * el ciclo completo dura tantos días como frases haya. Para agregar frases basta con
 * sumarlas al final de la lista.
 */
export const QUOTES: Quote[] = [
  // Séneca
  {
    text: 'No es que tengamos poco tiempo, sino que perdemos mucho. La vida es suficientemente larga para realizar grandes cosas, si se emplea bien toda ella.',
    author: 'Séneca, Sobre la brevedad de la vida',
  },
  {
    text: 'Mientras se aplaza, la vida pasa. Todas las cosas nos son ajenas; solo el tiempo es verdaderamente nuestro.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Son más las cosas que nos asustan que las que nos aplastan; sufrimos más a menudo en la imaginación que en la realidad.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'No nos atrevemos a muchas cosas porque son difíciles, pero son difíciles porque no nos atrevemos a hacerlas.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Empieza ya a vivir, y cuenta cada día como si fuera una vida entera.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Rodéate de quienes te harán mejor y recibe a quienes tú puedas mejorar. Es un intercambio: mientras enseñamos, aprendemos.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Quien está en todas partes no está en ninguna. Elige pocas cosas y entrégate a ellas por completo.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'No es pobre quien tiene poco, sino quien mucho desea. ¿La medida de la riqueza? Primero, tener lo necesario; después, lo suficiente.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'La vida es como una obra de teatro: no importa cuánto dure, sino lo bien que se haya representado.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Durante toda la vida hay que aprender a vivir. Nadie termina nunca ese aprendizaje, y eso es precisamente lo que lo hace valioso.',
    author: 'Séneca, Sobre la brevedad de la vida',
  },
  {
    text: 'El fuego prueba el oro; la adversidad, a las personas fuertes.',
    author: 'Séneca, Sobre la providencia',
  },
  {
    text: 'Lo que la razón no pudo curar, muchas veces lo curó el tiempo.',
    author: 'Séneca',
  },
  {
    text: 'Mientras vivamos, mientras estemos entre los seres humanos, cultivemos nuestra humanidad.',
    author: 'Séneca, Sobre la ira',
  },

  // Marco Aurelio
  {
    text: 'Al amanecer, cuando te cueste levantarte, ten presente este pensamiento: me levanto para hacer la obra propia de un ser humano.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Si algo externo te aflige, no es eso lo que te perturba, sino tu juicio sobre ello; y está en tu poder cambiar ese juicio ahora mismo.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'No sigas discutiendo sobre cómo debe ser una buena persona. Sé una.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Se necesita muy poco para vivir una vida feliz; todo está dentro de ti, en tu manera de pensar.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Mira hacia dentro: dentro está la fuente del bien, y siempre puede brotar si siempre sigues excavando.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Tal como sean tus pensamientos habituales, así será tu mente, porque el alma se tiñe del color de sus pensamientos.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Lo que impide la acción hace avanzar la acción. Lo que se interpone en el camino se convierte en el camino.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Si no conviene, no lo hagas; si no es verdad, no lo digas.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Haz cada cosa de tu vida como si fuera la última: con atención, sin prisa y sin fingir.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'No malgastes lo que te queda de vida pensando en lo que hacen los demás, a menos que con ello busques el bien común.',
    author: 'Marco Aurelio, Meditaciones',
  },

  // Epicteto
  {
    text: 'De las cosas, unas dependen de nosotros y otras no. De nosotros dependen el juicio, el deseo y la voluntad: todo lo que es obra nuestra.',
    author: 'Epicteto, Enquiridión',
  },
  {
    text: 'No son las cosas las que nos perturban, sino las opiniones que tenemos sobre las cosas.',
    author: 'Epicteto, Enquiridión',
  },
  {
    text: 'No pretendas que las cosas sucedan como quieres; quiere que sucedan como suceden, y vivirás en paz.',
    author: 'Epicteto, Enquiridión',
  },
  {
    text: 'Nada grande nace de repente, ni siquiera la uva o el higo. Si quieres un higo, dale tiempo: que primero florezca, luego dé fruto y después madure.',
    author: 'Epicteto, Disertaciones',
  },
  {
    text: 'Primero dite a ti mismo lo que quieres ser; después haz lo que tengas que hacer.',
    author: 'Epicteto, Disertaciones',
  },

  // Oriente
  {
    text: 'El árbol que apenas puedes abrazar nació de un brote diminuto; la torre de nueve pisos se levantó de un montón de tierra; el viaje de mil leguas comienza bajo tus pies.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Quien conoce a los demás es inteligente; quien se conoce a sí mismo es sabio. Quien vence a los demás es fuerte; quien se vence a sí mismo es poderoso.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Nada en el mundo es más blando y débil que el agua y, sin embargo, nada la supera para vencer lo duro y lo fuerte.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Afronta lo difícil mientras aún es fácil; realiza lo grande mientras aún es pequeño.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Cuando veas a una persona virtuosa, piensa en cómo igualarla; cuando veas a una que no lo es, examínate a ti mismo.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Saber que se sabe lo que se sabe, y que no se sabe lo que no se sabe: ese es el verdadero conocimiento.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Repasa lo antiguo y descubre lo nuevo: así podrás enseñar a otros.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Aprender sin reflexionar es tiempo perdido; reflexionar sin aprender es peligroso.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Somos lo que pensamos. Todo lo que somos surge de nuestros pensamientos; con ellos construimos el mundo.',
    author: 'Dhammapada',
  },
  {
    text: 'Mejor que mil palabras vacías es una sola palabra con sentido, que al oírla trae paz.',
    author: 'Dhammapada',
  },
  {
    text: 'El mejor momento para plantar un árbol fue hace veinte años. El segundo mejor momento es ahora.',
    author: 'Proverbio chino',
  },
  {
    text: 'Dímelo y lo olvidaré; enséñamelo y lo recordaré; involúcrame y lo aprenderé.',
    author: 'Proverbio chino',
  },
  {
    text: 'Cae siete veces y levántate ocho. Lo que cuenta no es cuántas veces caes, sino cuántas te vuelves a levantar.',
    author: 'Proverbio japonés',
  },

  // Grecia y Roma
  {
    text: 'Una golondrina no hace verano, ni un solo día; tampoco un solo día ni un breve tiempo hacen feliz a una persona.',
    author: 'Aristóteles, Ética a Nicómaco',
  },
  {
    text: 'Lo que hay que aprender a hacer, lo aprendemos haciéndolo: nos hacemos constructores construyendo y músicos tocando; y justos, practicando la justicia.',
    author: 'Aristóteles, Ética a Nicómaco',
  },
  {
    text: 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.',
    author: 'Will Durant, sobre Aristóteles',
  },
  {
    text: 'Una vida sin examen no merece ser vivida. Detente de vez en cuando a preguntarte qué haces y por qué lo haces.',
    author: 'Sócrates, según Platón',
  },
  {
    text: 'El comienzo es la parte más importante de cualquier trabajo.',
    author: 'Platón, La República',
  },
  {
    text: 'Nadie se baña dos veces en el mismo río, porque ni el río ni la persona son ya los mismos.',
    author: 'Heráclito',
  },
  {
    text: 'La vida es breve; el arte, largo; la ocasión, fugaz; la experiencia, engañosa; el juicio, difícil.',
    author: 'Hipócrates, Aforismos',
  },
  {
    text: 'Quien ha empezado ya tiene hecha la mitad del trabajo. Atrévete a saber: empieza.',
    author: 'Horacio, Epístolas',
  },
  {
    text: 'Aprovecha el día de hoy y confía lo menos posible en el mañana.',
    author: 'Horacio, Odas',
  },
  {
    text: 'Pueden, porque creen que pueden.',
    author: 'Virgilio, Eneida',
  },
  {
    text: 'La gota horada la piedra, no por su fuerza, sino por su constancia.',
    author: 'Proverbio latino',
  },
  {
    text: 'Es un mal plan el que no admite cambios.',
    author: 'Publilio Siro',
  },

  // Lengua española
  {
    text: 'Caminante, son tus huellas el camino y nada más; caminante, no hay camino, se hace camino al andar.',
    author: 'Antonio Machado',
  },
  {
    text: 'La diligencia es madre de la buena ventura, y la pereza, su contraria, jamás llegó al término que pide un buen deseo.',
    author: 'Miguel de Cervantes, Don Quijote',
  },
  {
    text: 'El que lee mucho y anda mucho, ve mucho y sabe mucho.',
    author: 'Miguel de Cervantes, Don Quijote',
  },
  {
    text: 'La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos; con ella no pueden igualarse los tesoros que encierra la tierra ni el mar.',
    author: 'Miguel de Cervantes, Don Quijote',
  },
  {
    text: 'Confía en el tiempo, que suele dar dulces salidas a muchas amargas dificultades.',
    author: 'Miguel de Cervantes',
  },
  {
    text: 'Lo bueno, si breve, dos veces bueno; y aun lo malo, si poco, no tan malo.',
    author: 'Baltasar Gracián, Oráculo manual',
  },
  {
    text: 'Nunca apresurarse ni apasionarse. Sea uno primero señor de sí, y lo será después de los demás.',
    author: 'Baltasar Gracián, Oráculo manual',
  },
  {
    text: 'Nada te turbe, nada te espante; todo se pasa. La paciencia todo lo alcanza.',
    author: 'Santa Teresa de Jesús',
  },
  {
    text: 'El que tiene fe en sí mismo no necesita que los demás crean en él.',
    author: 'Miguel de Unamuno',
  },
  {
    text: 'Yo soy yo y mi circunstancia, y si no la salvo a ella no me salvo yo.',
    author: 'José Ortega y Gasset',
  },
  {
    text: 'Ser culto es el único modo de ser libre. Leer, preguntar y aprender cada día es una forma de independencia.',
    author: 'José Martí',
  },
  {
    text: 'La mejor manera de decir es hacer.',
    author: 'José Martí',
  },
  {
    text: 'Las armas os han dado la independencia; las leyes os darán la libertad.',
    author: 'Francisco de Paula Santander',
  },
  {
    text: 'Entre los individuos, como entre las naciones, el respeto al derecho ajeno es la paz.',
    author: 'Benito Juárez',
  },

  // Europa moderna
  {
    text: 'No basta saber, también hay que aplicar; no basta querer, también hay que hacer.',
    author: 'Johann Wolfgang von Goethe',
  },
  {
    text: 'Trata a las personas como si fueran lo que deberían ser, y las ayudarás a convertirse en lo que son capaces de ser.',
    author: 'Johann Wolfgang von Goethe',
  },
  {
    text: 'La cosa más grande del mundo es saber pertenecerse a uno mismo.',
    author: 'Michel de Montaigne, Ensayos',
  },
  {
    text: 'Así como un día bien empleado trae un dulce sueño, una vida bien empleada trae una dulce muerte.',
    author: 'Leonardo da Vinci',
  },
  {
    text: 'Si he visto más lejos es porque me he subido a hombros de gigantes.',
    author: 'Isaac Newton',
  },
  {
    text: 'Quien tiene un porqué para vivir puede soportar casi cualquier cómo.',
    author: 'Friedrich Nietzsche',
  },
  {
    text: 'La paciencia es amarga, pero su fruto es dulce.',
    author: 'Jean-Jacques Rousseau',
  },
  {
    text: 'Todos piensan en cambiar el mundo, pero nadie piensa en cambiarse a sí mismo.',
    author: 'León Tolstói',
  },
  {
    text: 'La vida es como montar en bicicleta: para mantener el equilibrio hay que seguir avanzando.',
    author: 'Albert Einstein',
  },
  {
    text: 'Nada en la vida debe ser temido, solamente comprendido. Ahora es el momento de comprender más, para temer menos.',
    author: 'Marie Curie',
  },

  // América
  {
    text: 'Termina cada día y déjalo atrás. Hiciste lo que pudiste; seguro se colaron errores y torpezas: olvídalos pronto. Mañana es un nuevo día; empiézalo bien y con serenidad.',
    author: 'Ralph Waldo Emerson',
  },
  {
    text: 'Nada grande se ha logrado jamás sin entusiasmo.',
    author: 'Ralph Waldo Emerson',
  },
  {
    text: 'Si uno avanza con confianza en la dirección de sus sueños y se esfuerza por vivir la vida que ha imaginado, encontrará un éxito inesperado en las horas comunes.',
    author: 'Henry David Thoreau, Walden',
  },
  {
    text: 'Si has construido castillos en el aire, tu trabajo no se ha perdido: ahí es donde deben estar. Ahora ponles los cimientos debajo.',
    author: 'Henry David Thoreau, Walden',
  },
  {
    text: '¿Amas la vida? Entonces no desperdicies el tiempo, porque esa es la materia de la que está hecha la vida.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'La pereza avanza tan despacio que la pobreza no tarda en alcanzarla. ¿Tienes algo que hacer mañana? Hazlo hoy.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'Ten siempre presente que tu propia decisión de salir adelante es más importante que cualquier otra cosa.',
    author: 'Abraham Lincoln',
  },
  {
    text: 'Haz lo que puedas, con lo que tengas, donde estés.',
    author: 'Theodore Roosevelt',
  },
  {
    text: 'El optimismo es la fe que conduce al logro. Nada puede hacerse sin esperanza y confianza.',
    author: 'Helen Keller',
  },
  {
    text: 'Solos podemos hacer muy poco; juntos podemos hacer muchísimo.',
    author: 'Helen Keller',
  },
  {
    text: 'Si no puedes volar, corre; si no puedes correr, camina; si no puedes caminar, gatea. Pero hagas lo que hagas, sigue avanzando.',
    author: 'Martin Luther King Jr.',
  },
  {
    text: 'Nuestra mayor debilidad está en rendirnos. La forma más segura de tener éxito es intentarlo una vez más.',
    author: 'Thomas A. Edison',
  },
  {
    text: 'El genio es un uno por ciento de inspiración y un noventa y nueve por ciento de transpiración.',
    author: 'Thomas A. Edison',
  },
  {
    text: 'Tanto si crees que puedes como si crees que no puedes, tienes razón.',
    author: 'Henry Ford',
  },
  {
    text: 'Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de otra persona.',
    author: 'Steve Jobs',
  },
  {
    text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    author: 'Robert Collier',
  },
  {
    text: 'La disciplina es el puente entre las metas y los logros.',
    author: 'Jim Rohn',
  },
  {
    text: 'La vida es un diez por ciento lo que te sucede y un noventa por ciento cómo reaccionas a ello.',
    author: 'Charles R. Swindoll',
  },
  {
    text: 'No cuentes los días; haz que los días cuenten.',
    author: 'Muhammad Ali',
  },

  // Otros
  {
    text: 'Todo parece imposible hasta que se hace.',
    author: 'Nelson Mandela',
  },
  {
    text: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Vive como si fueras a morir mañana; aprende como si fueras a vivir siempre.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'Nuestra recompensa está en el esfuerzo y no en el resultado. Un esfuerzo total es una victoria completa.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'Al ser humano se le puede quitar todo menos una cosa: la última de sus libertades, elegir su actitud ante las circunstancias.',
    author: 'Viktor Frankl',
  },
  {
    text: 'No se puede cruzar el mar simplemente mirando el agua.',
    author: 'Rabindranath Tagore',
  },
  {
    text: 'Si quieres ir rápido, camina solo; si quieres llegar lejos, ve acompañado.',
    author: 'Proverbio africano',
  },
];

/** La frase de un día (YYYY-MM-DD): cambia cada día, igual en todos los dispositivos. */
export function quoteOfDay(key: string): Quote {
  const [y, m, d] = key.split('-').map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  return QUOTES[dayNumber % QUOTES.length];
}
