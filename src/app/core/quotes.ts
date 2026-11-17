import { isEn } from './i18n';

/** Frase motivadora del día, como en los calendarios de papel de hoja por día. */
export interface Quote {
  text: string;
  author: string;
}

interface BilingualQuote extends Quote {
  /** La frase en inglés (el original cuando el autor escribió en inglés). */
  en: string;
}

/** Autores y obras en inglés (los que cambian). */
const AUTHOR_EN: Record<string, string> = {
  'Marco Aurelio, Meditaciones': 'Marcus Aurelius, Meditations',
  'Séneca, Cartas a Lucilio': 'Seneca, Letters to Lucilius',
  'Séneca, Sobre la brevedad de la vida': 'Seneca, On the Shortness of Life',
  'Séneca, Sobre la providencia': 'Seneca, On Providence',
  'Séneca, Sobre la ira': 'Seneca, On Anger',
  Séneca: 'Seneca',
  'Lao-Tse, Tao Te Ching': 'Lao Tzu, Tao Te Ching',
  'Confucio, Analectas': 'Confucius, Analects',
  'Miguel de Cervantes, Don Quijote': 'Miguel de Cervantes, Don Quixote',
  'Epicteto, Enquiridión': 'Epictetus, Enchiridion',
  'Epicteto, Disertaciones': 'Epictetus, Discourses',
  'Baltasar Gracián, Oráculo manual': 'Baltasar Gracián, The Art of Worldly Wisdom',
  'Aristóteles, Ética a Nicómaco': 'Aristotle, Nicomachean Ethics',
  'Will Durant, sobre Aristóteles': 'Will Durant, on Aristotle',
  'Virgilio, Eneida': 'Virgil, Aeneid',
  'Sócrates, según Platón': 'Socrates, according to Plato',
  'Platón, La República': 'Plato, The Republic',
  'Santa Teresa de Jesús': 'Saint Teresa of Ávila',
  'Publilio Siro': 'Publilius Syrus',
  'Proverbio chino': 'Chinese proverb',
  'Proverbio latino': 'Latin proverb',
  'Proverbio japonés': 'Japanese proverb',
  'Proverbio africano': 'African proverb',
  'Michel de Montaigne, Ensayos': 'Michel de Montaigne, Essays',
  'León Tolstói': 'Leo Tolstoy',
  'Horacio, Odas': 'Horace, Odes',
  'Horacio, Epístolas': 'Horace, Epistles',
  'Hipócrates, Aforismos': 'Hippocrates, Aphorisms',
  Heráclito: 'Heraclitus',
};

/**
 * Banco de frases. Cada día muestra la siguiente, así que dos días seguidos nunca repiten;
 * el ciclo completo dura tantos días como frases haya. Para agregar frases basta con
 * sumarlas al final de la lista.
 */
export const QUOTES: BilingualQuote[] = [
  // Séneca
  {
    text: 'No es que tengamos poco tiempo, sino que perdemos mucho. La vida es suficientemente larga para realizar grandes cosas, si se emplea bien toda ella.',
    en: 'It is not that we have a short time to live, but that we waste a lot of it. Life is long enough to achieve great things, if the whole of it is well invested.',
    author: 'Séneca, Sobre la brevedad de la vida',
  },
  {
    text: 'Mientras se aplaza, la vida pasa. Todas las cosas nos son ajenas; solo el tiempo es verdaderamente nuestro.',
    en: 'While we postpone, life goes by. All things are alien to us; only time is truly ours.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Son más las cosas que nos asustan que las que nos aplastan; sufrimos más a menudo en la imaginación que en la realidad.',
    en: 'There are more things that frighten us than crush us; we suffer more often in imagination than in reality.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'No nos atrevemos a muchas cosas porque son difíciles, pero son difíciles porque no nos atrevemos a hacerlas.',
    en: 'It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Empieza ya a vivir, y cuenta cada día como si fuera una vida entera.',
    en: 'Begin at once to live, and count each day as if it were a whole life.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Rodéate de quienes te harán mejor y recibe a quienes tú puedas mejorar. Es un intercambio: mientras enseñamos, aprendemos.',
    en: 'Surround yourself with those who will make you better and welcome those you can improve. It works both ways: while we teach, we learn.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Quien está en todas partes no está en ninguna. Elige pocas cosas y entrégate a ellas por completo.',
    en: 'Whoever is everywhere is nowhere. Choose a few things and devote yourself fully to them.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'No es pobre quien tiene poco, sino quien mucho desea. ¿La medida de la riqueza? Primero, tener lo necesario; después, lo suficiente.',
    en: 'It is not the one who has little who is poor, but the one who craves more. The measure of wealth? First, having what is necessary; then, what is enough.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'La vida es como una obra de teatro: no importa cuánto dure, sino lo bien que se haya representado.',
    en: 'Life is like a play: it is not how long it lasts that matters, but how well it is acted.',
    author: 'Séneca, Cartas a Lucilio',
  },
  {
    text: 'Durante toda la vida hay que aprender a vivir. Nadie termina nunca ese aprendizaje, y eso es precisamente lo que lo hace valioso.',
    en: 'Throughout our whole life we must keep learning how to live. Nobody ever finishes that lesson, and that is exactly what makes it valuable.',
    author: 'Séneca, Sobre la brevedad de la vida',
  },
  {
    text: 'El fuego prueba el oro; la adversidad, a las personas fuertes.',
    en: 'Fire tests gold; adversity tests strong people.',
    author: 'Séneca, Sobre la providencia',
  },
  {
    text: 'Lo que la razón no pudo curar, muchas veces lo curó el tiempo.',
    en: 'What reason could not heal, time has often healed.',
    author: 'Séneca',
  },
  {
    text: 'Mientras vivamos, mientras estemos entre los seres humanos, cultivemos nuestra humanidad.',
    en: 'As long as we live, as long as we are among human beings, let us cherish our humanity.',
    author: 'Séneca, Sobre la ira',
  },

  // Marco Aurelio
  {
    text: 'Al amanecer, cuando te cueste levantarte, ten presente este pensamiento: me levanto para hacer la obra propia de un ser humano.',
    en: 'At dawn, when you have trouble getting out of bed, tell yourself: I am rising to do the work of a human being.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Si algo externo te aflige, no es eso lo que te perturba, sino tu juicio sobre ello; y está en tu poder cambiar ese juicio ahora mismo.',
    en: 'If you are distressed by anything external, it is not the thing itself that troubles you, but your judgment of it; and you have the power to change that judgment right now.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'No sigas discutiendo sobre cómo debe ser una buena persona. Sé una.',
    en: 'Waste no more time arguing about what a good person should be. Be one.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Se necesita muy poco para vivir una vida feliz; todo está dentro de ti, en tu manera de pensar.',
    en: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Mira hacia dentro: dentro está la fuente del bien, y siempre puede brotar si siempre sigues excavando.',
    en: 'Look within: within is the fountain of good, and it will always bubble up if you keep digging.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Tal como sean tus pensamientos habituales, así será tu mente, porque el alma se tiñe del color de sus pensamientos.',
    en: 'As your habitual thoughts are, so will your mind be, for the soul is dyed by the color of its thoughts.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Lo que impide la acción hace avanzar la acción. Lo que se interpone en el camino se convierte en el camino.',
    en: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Si no conviene, no lo hagas; si no es verdad, no lo digas.',
    en: 'If it is not right, do not do it; if it is not true, do not say it.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'Haz cada cosa de tu vida como si fuera la última: con atención, sin prisa y sin fingir.',
    en: 'Do everything in your life as if it were the last thing: with attention, without haste and without pretense.',
    author: 'Marco Aurelio, Meditaciones',
  },
  {
    text: 'No malgastes lo que te queda de vida pensando en lo que hacen los demás, a menos que con ello busques el bien común.',
    en: 'Do not waste what remains of your life thinking about what others are doing, unless it serves the common good.',
    author: 'Marco Aurelio, Meditaciones',
  },

  // Epicteto
  {
    text: 'De las cosas, unas dependen de nosotros y otras no. De nosotros dependen el juicio, el deseo y la voluntad: todo lo que es obra nuestra.',
    en: 'Some things are within our control and others are not. Within our control are judgment, desire and will: everything that is our own doing.',
    author: 'Epicteto, Enquiridión',
  },
  {
    text: 'No son las cosas las que nos perturban, sino las opiniones que tenemos sobre las cosas.',
    en: 'People are not disturbed by things, but by the views they take of them.',
    author: 'Epicteto, Enquiridión',
  },
  {
    text: 'No pretendas que las cosas sucedan como quieres; quiere que sucedan como suceden, y vivirás en paz.',
    en: 'Do not wish for things to happen as you want; want them to happen as they do, and you will be at peace.',
    author: 'Epicteto, Enquiridión',
  },
  {
    text: 'Nada grande nace de repente, ni siquiera la uva o el higo. Si quieres un higo, dale tiempo: que primero florezca, luego dé fruto y después madure.',
    en: 'Nothing great comes into being all at once, not even the grape or the fig. If you want a fig, give it time: let it first blossom, then bear fruit, then ripen.',
    author: 'Epicteto, Disertaciones',
  },
  {
    text: 'Primero dite a ti mismo lo que quieres ser; después haz lo que tengas que hacer.',
    en: 'First say to yourself what you would be; then do what you have to do.',
    author: 'Epicteto, Disertaciones',
  },

  // Oriente
  {
    text: 'El árbol que apenas puedes abrazar nació de un brote diminuto; la torre de nueve pisos se levantó de un montón de tierra; el viaje de mil leguas comienza bajo tus pies.',
    en: 'The tree you can barely embrace grew from a tiny shoot; the nine-story tower rose from a heap of earth; the journey of a thousand miles begins beneath your feet.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Quien conoce a los demás es inteligente; quien se conoce a sí mismo es sabio. Quien vence a los demás es fuerte; quien se vence a sí mismo es poderoso.',
    en: 'Knowing others is intelligence; knowing yourself is wisdom. Mastering others is strength; mastering yourself is true power.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Nada en el mundo es más blando y débil que el agua y, sin embargo, nada la supera para vencer lo duro y lo fuerte.',
    en: 'Nothing in the world is softer and weaker than water, and yet nothing surpasses it in overcoming the hard and the strong.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Afronta lo difícil mientras aún es fácil; realiza lo grande mientras aún es pequeño.',
    en: 'Tackle the difficult while it is still easy; achieve the great while it is still small.',
    author: 'Lao-Tse, Tao Te Ching',
  },
  {
    text: 'Cuando veas a una persona virtuosa, piensa en cómo igualarla; cuando veas a una que no lo es, examínate a ti mismo.',
    en: 'When you see a worthy person, think of how to equal them; when you see one who is not, examine yourself.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Saber que se sabe lo que se sabe, y que no se sabe lo que no se sabe: ese es el verdadero conocimiento.',
    en: 'To know what you know and to know what you do not know: that is true knowledge.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Repasa lo antiguo y descubre lo nuevo: así podrás enseñar a otros.',
    en: 'Review the old and discover the new: then you will be able to teach others.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Aprender sin reflexionar es tiempo perdido; reflexionar sin aprender es peligroso.',
    en: 'Learning without reflection is wasted time; reflection without learning is dangerous.',
    author: 'Confucio, Analectas',
  },
  {
    text: 'Somos lo que pensamos. Todo lo que somos surge de nuestros pensamientos; con ellos construimos el mundo.',
    en: 'We are what we think. All that we are arises from our thoughts; with them we build the world.',
    author: 'Dhammapada',
  },
  {
    text: 'Mejor que mil palabras vacías es una sola palabra con sentido, que al oírla trae paz.',
    en: 'Better than a thousand empty words is a single meaningful word that brings peace when heard.',
    author: 'Dhammapada',
  },
  {
    text: 'El mejor momento para plantar un árbol fue hace veinte años. El segundo mejor momento es ahora.',
    en: 'The best time to plant a tree was twenty years ago. The second best time is now.',
    author: 'Proverbio chino',
  },
  {
    text: 'Dímelo y lo olvidaré; enséñamelo y lo recordaré; involúcrame y lo aprenderé.',
    en: 'Tell me and I will forget; teach me and I will remember; involve me and I will learn.',
    author: 'Proverbio chino',
  },
  {
    text: 'Cae siete veces y levántate ocho. Lo que cuenta no es cuántas veces caes, sino cuántas te vuelves a levantar.',
    en: 'Fall seven times and stand up eight. What counts is not how many times you fall, but how many times you get back up.',
    author: 'Proverbio japonés',
  },

  // Grecia y Roma
  {
    text: 'Una golondrina no hace verano, ni un solo día; tampoco un solo día ni un breve tiempo hacen feliz a una persona.',
    en: 'One swallow does not make a summer, nor does one day; and so too one day or a short time does not make a person happy.',
    author: 'Aristóteles, Ética a Nicómaco',
  },
  {
    text: 'Lo que hay que aprender a hacer, lo aprendemos haciéndolo: nos hacemos constructores construyendo y músicos tocando; y justos, practicando la justicia.',
    en: 'What we have to learn to do, we learn by doing: we become builders by building and musicians by playing; and just, by practicing justice.',
    author: 'Aristóteles, Ética a Nicómaco',
  },
  {
    text: 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.',
    en: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Will Durant, sobre Aristóteles',
  },
  {
    text: 'Una vida sin examen no merece ser vivida. Detente de vez en cuando a preguntarte qué haces y por qué lo haces.',
    en: 'The unexamined life is not worth living. Stop now and then to ask yourself what you are doing and why.',
    author: 'Sócrates, según Platón',
  },
  {
    text: 'El comienzo es la parte más importante de cualquier trabajo.',
    en: 'The beginning is the most important part of any work.',
    author: 'Platón, La República',
  },
  {
    text: 'Nadie se baña dos veces en el mismo río, porque ni el río ni la persona son ya los mismos.',
    en: 'No one steps in the same river twice, for neither the river nor the person is the same.',
    author: 'Heráclito',
  },
  {
    text: 'La vida es breve; el arte, largo; la ocasión, fugaz; la experiencia, engañosa; el juicio, difícil.',
    en: 'Life is short, the art long, opportunity fleeting, experience deceptive, judgment difficult.',
    author: 'Hipócrates, Aforismos',
  },
  {
    text: 'Quien ha empezado ya tiene hecha la mitad del trabajo. Atrévete a saber: empieza.',
    en: 'Whoever has begun has half the work done. Dare to know: begin.',
    author: 'Horacio, Epístolas',
  },
  {
    text: 'Aprovecha el día de hoy y confía lo menos posible en el mañana.',
    en: 'Seize the day, and put as little trust as possible in tomorrow.',
    author: 'Horacio, Odas',
  },
  {
    text: 'Pueden, porque creen que pueden.',
    en: 'They can, because they think they can.',
    author: 'Virgilio, Eneida',
  },
  {
    text: 'La gota horada la piedra, no por su fuerza, sino por su constancia.',
    en: 'Dripping water hollows out stone, not through force but through persistence.',
    author: 'Proverbio latino',
  },
  {
    text: 'Es un mal plan el que no admite cambios.',
    en: 'It is a bad plan that admits no change.',
    author: 'Publilio Siro',
  },

  // Lengua española
  {
    text: 'Caminante, son tus huellas el camino y nada más; caminante, no hay camino, se hace camino al andar.',
    en: 'Traveler, your footprints are the path and nothing more; traveler, there is no path, the path is made by walking.',
    author: 'Antonio Machado',
  },
  {
    text: 'La diligencia es madre de la buena ventura, y la pereza, su contraria, jamás llegó al término que pide un buen deseo.',
    en: 'Diligence is the mother of good fortune, and idleness, its opposite, never reached the goal that a good wish asks for.',
    author: 'Miguel de Cervantes, Don Quijote',
  },
  {
    text: 'El que lee mucho y anda mucho, ve mucho y sabe mucho.',
    en: 'Whoever reads much and walks much, sees much and knows much.',
    author: 'Miguel de Cervantes, Don Quijote',
  },
  {
    text: 'La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos; con ella no pueden igualarse los tesoros que encierra la tierra ni el mar.',
    en: 'Freedom, Sancho, is one of the most precious gifts that heaven has given to humankind; no treasure the earth holds or the sea conceals can compare with it.',
    author: 'Miguel de Cervantes, Don Quijote',
  },
  {
    text: 'Confía en el tiempo, que suele dar dulces salidas a muchas amargas dificultades.',
    en: 'Trust in time, which usually brings sweet endings to many bitter difficulties.',
    author: 'Miguel de Cervantes',
  },
  {
    text: 'Lo bueno, si breve, dos veces bueno; y aun lo malo, si poco, no tan malo.',
    en: 'Good things, if brief, are twice as good; and even bad things, if few, are not so bad.',
    author: 'Baltasar Gracián, Oráculo manual',
  },
  {
    text: 'Nunca apresurarse ni apasionarse. Sea uno primero señor de sí, y lo será después de los demás.',
    en: 'Never hurry and never get carried away. Be master of yourself first, and you will later be master of others.',
    author: 'Baltasar Gracián, Oráculo manual',
  },
  {
    text: 'Nada te turbe, nada te espante; todo se pasa. La paciencia todo lo alcanza.',
    en: 'Let nothing disturb you, let nothing frighten you; all things pass. Patience obtains everything.',
    author: 'Santa Teresa de Jesús',
  },
  {
    text: 'El que tiene fe en sí mismo no necesita que los demás crean en él.',
    en: 'Whoever has faith in themselves does not need others to believe in them.',
    author: 'Miguel de Unamuno',
  },
  {
    text: 'Yo soy yo y mi circunstancia, y si no la salvo a ella no me salvo yo.',
    en: 'I am I and my circumstance, and if I do not save it, I do not save myself.',
    author: 'José Ortega y Gasset',
  },
  {
    text: 'Ser culto es el único modo de ser libre. Leer, preguntar y aprender cada día es una forma de independencia.',
    en: 'Being cultured is the only way to be free. Reading, asking and learning every day is a form of independence.',
    author: 'José Martí',
  },
  {
    text: 'La mejor manera de decir es hacer.',
    en: 'The best way of saying is doing.',
    author: 'José Martí',
  },
  {
    text: 'Las armas os han dado la independencia; las leyes os darán la libertad.',
    en: 'Arms have given you independence; laws will give you freedom.',
    author: 'Francisco de Paula Santander',
  },
  {
    text: 'Entre los individuos, como entre las naciones, el respeto al derecho ajeno es la paz.',
    en: 'Among individuals, as among nations, respect for the rights of others is peace.',
    author: 'Benito Juárez',
  },

  // Europa moderna
  {
    text: 'No basta saber, también hay que aplicar; no basta querer, también hay que hacer.',
    en: 'Knowing is not enough; we must apply. Willing is not enough; we must do.',
    author: 'Johann Wolfgang von Goethe',
  },
  {
    text: 'Trata a las personas como si fueran lo que deberían ser, y las ayudarás a convertirse en lo que son capaces de ser.',
    en: 'Treat people as if they were what they ought to be, and you help them become what they are capable of being.',
    author: 'Johann Wolfgang von Goethe',
  },
  {
    text: 'La cosa más grande del mundo es saber pertenecerse a uno mismo.',
    en: 'The greatest thing in the world is to know how to belong to oneself.',
    author: 'Michel de Montaigne, Ensayos',
  },
  {
    text: 'Así como un día bien empleado trae un dulce sueño, una vida bien empleada trae una dulce muerte.',
    en: 'As a day well spent brings sweet sleep, so a life well spent brings a sweet death.',
    author: 'Leonardo da Vinci',
  },
  {
    text: 'Si he visto más lejos es porque me he subido a hombros de gigantes.',
    en: 'If I have seen further, it is by standing on the shoulders of giants.',
    author: 'Isaac Newton',
  },
  {
    text: 'Quien tiene un porqué para vivir puede soportar casi cualquier cómo.',
    en: 'Whoever has a why to live can bear almost any how.',
    author: 'Friedrich Nietzsche',
  },
  {
    text: 'La paciencia es amarga, pero su fruto es dulce.',
    en: 'Patience is bitter, but its fruit is sweet.',
    author: 'Jean-Jacques Rousseau',
  },
  {
    text: 'Todos piensan en cambiar el mundo, pero nadie piensa en cambiarse a sí mismo.',
    en: 'Everyone thinks of changing the world, but no one thinks of changing themselves.',
    author: 'León Tolstói',
  },
  {
    text: 'La vida es como montar en bicicleta: para mantener el equilibrio hay que seguir avanzando.',
    en: 'Life is like riding a bicycle: to keep your balance you must keep moving.',
    author: 'Albert Einstein',
  },
  {
    text: 'Nada en la vida debe ser temido, solamente comprendido. Ahora es el momento de comprender más, para temer menos.',
    en: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    author: 'Marie Curie',
  },

  // América
  {
    text: 'Termina cada día y déjalo atrás. Hiciste lo que pudiste; seguro se colaron errores y torpezas: olvídalos pronto. Mañana es un nuevo día; empiézalo bien y con serenidad.',
    en: 'Finish each day and be done with it. You have done what you could; some blunders and absurdities no doubt crept in: forget them as soon as you can. Tomorrow is a new day; begin it well and serenely.',
    author: 'Ralph Waldo Emerson',
  },
  {
    text: 'Nada grande se ha logrado jamás sin entusiasmo.',
    en: 'Nothing great was ever achieved without enthusiasm.',
    author: 'Ralph Waldo Emerson',
  },
  {
    text: 'Si uno avanza con confianza en la dirección de sus sueños y se esfuerza por vivir la vida que ha imaginado, encontrará un éxito inesperado en las horas comunes.',
    en: 'If one advances confidently in the direction of their dreams, and endeavors to live the life they have imagined, they will meet with a success unexpected in common hours.',
    author: 'Henry David Thoreau, Walden',
  },
  {
    text: 'Si has construido castillos en el aire, tu trabajo no se ha perdido: ahí es donde deben estar. Ahora ponles los cimientos debajo.',
    en: 'If you have built castles in the air, your work need not be lost; that is where they should be. Now put the foundations under them.',
    author: 'Henry David Thoreau, Walden',
  },
  {
    text: '¿Amas la vida? Entonces no desperdicies el tiempo, porque esa es la materia de la que está hecha la vida.',
    en: 'Do you love life? Then do not squander time, for that is the stuff life is made of.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'La pereza avanza tan despacio que la pobreza no tarda en alcanzarla. ¿Tienes algo que hacer mañana? Hazlo hoy.',
    en: 'Laziness travels so slowly that poverty soon overtakes it. Have you something to do tomorrow? Do it today.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'Ten siempre presente que tu propia decisión de salir adelante es más importante que cualquier otra cosa.',
    en: 'Always bear in mind that your own resolution to succeed is more important than any other one thing.',
    author: 'Abraham Lincoln',
  },
  {
    text: 'Haz lo que puedas, con lo que tengas, donde estés.',
    en: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt',
  },
  {
    text: 'El optimismo es la fe que conduce al logro. Nada puede hacerse sin esperanza y confianza.',
    en: 'Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.',
    author: 'Helen Keller',
  },
  {
    text: 'Solos podemos hacer muy poco; juntos podemos hacer muchísimo.',
    en: 'Alone we can do so little; together we can do so much.',
    author: 'Helen Keller',
  },
  {
    text: 'Si no puedes volar, corre; si no puedes correr, camina; si no puedes caminar, gatea. Pero hagas lo que hagas, sigue avanzando.',
    en: 'If you can\'t fly, run; if you can\'t run, walk; if you can\'t walk, crawl. But whatever you do, keep moving forward.',
    author: 'Martin Luther King Jr.',
  },
  {
    text: 'Nuestra mayor debilidad está en rendirnos. La forma más segura de tener éxito es intentarlo una vez más.',
    en: 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.',
    author: 'Thomas A. Edison',
  },
  {
    text: 'El genio es un uno por ciento de inspiración y un noventa y nueve por ciento de transpiración.',
    en: 'Genius is one percent inspiration and ninety-nine percent perspiration.',
    author: 'Thomas A. Edison',
  },
  {
    text: 'Tanto si crees que puedes como si crees que no puedes, tienes razón.',
    en: 'Whether you think you can, or you think you can\'t, you\'re right.',
    author: 'Henry Ford',
  },
  {
    text: 'Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de otra persona.',
    en: 'Your time is limited, so don\'t waste it living someone else\'s life.',
    author: 'Steve Jobs',
  },
  {
    text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    en: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    text: 'La disciplina es el puente entre las metas y los logros.',
    en: 'Discipline is the bridge between goals and accomplishment.',
    author: 'Jim Rohn',
  },
  {
    text: 'La vida es un diez por ciento lo que te sucede y un noventa por ciento cómo reaccionas a ello.',
    en: 'Life is ten percent what happens to you and ninety percent how you react to it.',
    author: 'Charles R. Swindoll',
  },
  {
    text: 'No cuentes los días; haz que los días cuenten.',
    en: 'Don\'t count the days; make the days count.',
    author: 'Muhammad Ali',
  },

  // Otros
  {
    text: 'Todo parece imposible hasta que se hace.',
    en: 'It always seems impossible until it\'s done.',
    author: 'Nelson Mandela',
  },
  {
    text: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.',
    en: 'Education is the most powerful weapon you can use to change the world.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Vive como si fueras a morir mañana; aprende como si fueras a vivir siempre.',
    en: 'Live as if you were to die tomorrow; learn as if you were to live forever.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'Nuestra recompensa está en el esfuerzo y no en el resultado. Un esfuerzo total es una victoria completa.',
    en: 'Our reward is in the effort and not in the result. A full effort is a full victory.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'Al ser humano se le puede quitar todo menos una cosa: la última de sus libertades, elegir su actitud ante las circunstancias.',
    en: 'Everything can be taken from a person but one thing: the last of the human freedoms, to choose one\'s attitude in any given set of circumstances.',
    author: 'Viktor Frankl',
  },
  {
    text: 'No se puede cruzar el mar simplemente mirando el agua.',
    en: 'You can\'t cross the sea merely by staring at the water.',
    author: 'Rabindranath Tagore',
  },
  {
    text: 'Si quieres ir rápido, camina solo; si quieres llegar lejos, ve acompañado.',
    en: 'If you want to go fast, go alone; if you want to go far, go together.',
    author: 'Proverbio africano',
  },
];

/** La frase de un día (YYYY-MM-DD): cambia cada día, igual en todos los dispositivos. */
export function quoteOfDay(key: string): Quote {
  const [y, m, d] = key.split('-').map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  const quote = QUOTES[dayNumber % QUOTES.length];
  return isEn() ? { text: quote.en, author: AUTHOR_EN[quote.author] ?? quote.author } : quote;
}
