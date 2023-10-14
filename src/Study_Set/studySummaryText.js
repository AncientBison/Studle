export function getSummaryText(score) {
if (score == 100) {
  return shuffle([
    "Wow! You aced that!",
    "Great job! You aced it!",
    "Well done! Perfect score!",
    "Impressive! You nailed it!",
    "Wow, you crushed that!",
    "Bravo! Flawless performance!",
    "Excellent work! Aced it!",
    "You rocked that!",
    "Awesome job! Perfect result!",
    "Outstanding! You aced it!",
    "Incredible! You smashed it!",
    "You're a superstar! Perfect score!",
    "Flawless victory! You aced it!",
    "Superb! Your performance is exceptional!",
    "You're unstoppable! Perfect score achieved!",
    "Phenomenal! You aced it with flying colors!",
    "Spectacular job! Perfect score earned!",
    "Amazing work! You aced it like a pro!",
    "Perfection achieved! You're a star!"
  ])[0];
} else if (score >= 93) {
  return shuffle([
    "Awesome work! Keep it up!",
    "You're excelling! Keep pushing forward!",
    "Fantastic job! Your performance is outstanding!",
    "Brilliant! You're achieving remarkable results!",
    "Impressive work! Your dedication is paying off!",
    "Superb effort! You're on the path to greatness!",
    "Terrific performance! Your hard work is shining!",
    "Exceptional work! You're setting new standards!"
  ])[0];
} else if (score >= 80) {
  return shuffle([
    "Well done! You're doing really well!",
    "Good job! Keep up the great work!",
    "You're making good progress!",
    "Great effort! Your commitment is commendable!",
    "Nice going! Your results are improving!",
    "Impressive progress! You're on the right track!",
    "Awesome performance! Your hard work is paying off!",
    "Excellent job! You're consistently excelling!"
  ])[0];
} else if (score >= 70) {
  return shuffle([
    "Keep it up! You're on the right track!",
    "You're getting better! Keep going!",
    "Nice work! Your skills are improving!",
    "You're making strides! Keep pushing forward!",
    "Great going! You're making good progress!",
  ])[0];
} else if (score >= 60) {
  return shuffle([
    "Keep trying! You're making progress!",
    "Stay motivated! You're on your way!",
    "Don't give up! Your efforts will pay off!",
    "You're improving! Keep pushing yourself!",
    "Good job! Your hard work is showing!",
    "You're making headway! Keep moving forward!",
  ])[0];
} else {
  return shuffle([
    "Keep going! Every effort counts!",
    "Believe in yourself! You've got this!",
    "Don't give up! You can do it!",
  ])[0];
}
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}