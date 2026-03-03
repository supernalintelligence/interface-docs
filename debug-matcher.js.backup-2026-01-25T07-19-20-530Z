/**
 * Debug script to test fuzzy matching logic
 */

// Levenshtein distance
function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - levenshtein(longer, shorter)) / longerLength;
}

// Simulate the fuzzy matcher logic
function testMatch(query, example) {
  const lowerQuery = query.toLowerCase().trim();
  const exampleNormalized = example.toLowerCase().replace(/\{[^}]+\}/g, '').trim();

  const queryWords = lowerQuery.split(/\s+/);
  const patternWords = exampleNormalized.split(/\s+/).filter(w => w.length > 0);

  console.log(`\nTesting: "${query}" vs "${example}"`);
  console.log(`  Query words: [${queryWords.join(', ')}]`);
  console.log(`  Pattern words: [${patternWords.join(', ')}]`);

  let bestScore = 0;

  // Check similarity
  const simScore = similarity(lowerQuery, exampleNormalized);
  if (simScore > bestScore) {
    bestScore = simScore;
  }
  console.log(`  Similarity score: ${simScore.toFixed(3)}`);

  // If query starts with the same words as the pattern, it's likely a match with parameter
  if (patternWords.length > 0 && queryWords.length >= patternWords.length) {
    const matchesPattern = patternWords.every((word, i) =>
      queryWords[i] && queryWords[i].includes(word)
    );

    if (matchesPattern) {
      const paramScore = 0.85 + (patternWords.length / queryWords.length * 0.10);
      console.log(`  Pattern match score: ${paramScore.toFixed(3)}`);
      if (paramScore > bestScore) {
        bestScore = paramScore;
      }
    }
  }

  if (bestScore > 0.5) {
    console.log(`  ✓ MATCH! Best score: ${bestScore.toFixed(3)}`);
    return { match: true, score: bestScore };
  }

  console.log(`  ✗ No match (best score: ${bestScore.toFixed(3)})`);
  return { match: false };
}

// Test the problematic queries
console.log('=== Testing "open your users" ===');

// Blog search examples
testMatch('open your users', 'open blog {query}');
testMatch('open your users', 'show blog {query}');
testMatch('open your users', 'search blog {query}');
testMatch('open your users', 'find blog {query}');

// Stories navigation examples
testMatch('open your users', 'go to stories');
testMatch('open your users', 'navigate to stories');
testMatch('open your users', 'stories');
testMatch('open your users', '/stories');

console.log('\n=== Testing "open agentic ux" ===');
testMatch('open agentic ux', 'open blog {query}');
testMatch('open agentic ux', 'go to stories');
testMatch('open agentic ux', 'stories');

console.log('\n=== Testing "open 80% less" ===');
testMatch('open 80% less', 'open blog {query}');
testMatch('open 80% less', 'go to stories');
testMatch('open 80% less', 'stories');
