/** Frase motivadora del mes, como en los calendarios de papel. */
export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: 'La vida no se ha hecho para comprenderla, sino para vivirla.', author: 'George Santayana' },
  { text: 'La vida es un 10 % lo que te sucede y un 90 % cómo reaccionas a ello.', author: 'Charles R. Swindoll' },
  { text: 'El que tiene fe en sí mismo no necesita que los demás crean en él.', author: 'Miguel de Unamuno' },
  { text: 'Caminante, no hay camino, se hace camino al andar.', author: 'Antonio Machado' },
  { text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.', author: 'Robert Collier' },
  { text: 'No cuentes los días, haz que los días cuenten.', author: 'Muhammad Ali' },
  { text: 'La disciplina es el puente entre las metas y los logros.', author: 'Jim Rohn' },
  { text: 'Haz lo que puedas, con lo que tengas, donde estés.', author: 'Theodore Roosevelt' },
  { text: 'Un viaje de mil millas comienza con un solo paso.', author: 'Lao-Tse' },
  { text: 'Todo parece imposible hasta que se hace.', author: 'Nelson Mandela' },
  { text: 'No es que tengamos poco tiempo, sino que perdemos mucho.', author: 'Séneca' },
  { text: 'Cae siete veces, levántate ocho.', author: 'Proverbio japonés' },
  { text: 'Quien tiene un porqué para vivir puede soportar casi cualquier cómo.', author: 'Friedrich Nietzsche' },
  { text: 'La paciencia es amarga, pero su fruto es dulce.', author: 'Jean-Jacques Rousseau' },
  { text: 'El genio es un 1 % de inspiración y un 99 % de transpiración.', author: 'Thomas A. Edison' },
  { text: 'Nuestra recompensa se encuentra en el esfuerzo y no en el resultado.', author: 'Mahatma Gandhi' },
  { text: 'Si uno no sabe a qué puerto navega, ningún viento le es favorable.', author: 'Séneca' },
  { text: 'La constancia es la virtud por la que todas las otras dan fruto.', author: 'Arturo Graf' },
  { text: 'Somos lo que hacemos repetidamente. La excelencia no es un acto, sino un hábito.', author: 'Will Durant' },
  { text: 'Yo soy yo y mi circunstancia.', author: 'José Ortega y Gasset' },
  { text: 'La felicidad no es algo hecho. Proviene de tus propias acciones.', author: 'Dalái Lama' },
  { text: 'Lo que con mucho trabajo se adquiere, más se ama.', author: 'Aristóteles' },
  { text: 'Vive como si fueras a morir mañana; aprende como si fueras a vivir siempre.', author: 'Mahatma Gandhi' },
  { text: 'El tiempo es el mejor autor: siempre encuentra un final perfecto.', author: 'Charles Chaplin' },
];

/** La frase de un mes: cambia cada mes y no se repite en dos años seguidos. */
export function quoteOfMonth(year: number, month: number): Quote {
  return QUOTES[(year * 12 + month) % QUOTES.length];
}
