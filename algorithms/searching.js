export const linearSearch = {
    name: "Linear Search",
    complexity: { time: "O(n)", space: "O(1)", preconditions: "None" },
    code: `procedure linearSearch(A, target):
  for i = 0 to length(A) - 1:
    if A[i] == target:
      return i
  return -1`,
    funFact: "Linear search is rarely used in production databases but is often faster than binary search for very small arrays due to cache locality and no sorting requirement.",
    run: function* (input, target) {
        let comparisons = 0;
        for (let i = 0; i < input.length; i++) {
            comparisons++;
            yield {
                data: [...input],
                highlights: [i],
                line: 3,
                metrics: { comparisons },
                narrative: `Checking index ${i}: Is ${input[i]} == ${target}?`
            };

            if (input[i] === target) {
                yield {
                    data: [...input],
                    highlights: [i],
                    line: 4,
                    metrics: { comparisons },
                    narrative: `Target ${target} found at index ${i}!`
                };
                return;
            }
        }
        yield { data: [...input], line: 5, narrative: "Target not found." };
    }
};

export const binarySearch = {
    name: "Binary Search",
    complexity: { time: "O(log n)", space: "O(1)", preconditions: "Sorted Array" },
    code: `procedure binarySearch(A, target):
  low = 0, high = length(A) - 1
  while low <= high:
    mid = floor((low + high) / 2)
    if A[mid] < target: low = mid + 1
    else if A[mid] > target: high = mid - 1
    else: return mid
  return -1`,
    funFact: "A bug in java.util.Arrays.binarySearch persisted for 9 years: (low + high) / 2 can overflow integer limits.",
    run: function* (input, target) {
        let arr = [...input];
        let low = 0;
        let high = arr.length - 1;
        let comparisons = 0;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            comparisons++;
            
            yield {
                data: [...arr],
                highlights: [mid],
                activeRange: [low, high],
                line: 3,
                metrics: { comparisons },
                narrative: `Searching range [${low}, ${high}]. Midpoint is index ${mid} (${arr[mid]}).`
            };

            if (arr[mid] === target) {
                yield {
                    data: [...arr], highlights: [mid], activeRange: [mid, mid], line: 6,
                    metrics: { comparisons }, narrative: `Target ${target} found at index ${mid}.`
                };
                return;
            } else if (arr[mid] < target) {
                low = mid + 1;
                yield { data: [...arr], highlights: [mid], activeRange: [low, high], line: 4, metrics:{comparisons}, narrative: `${arr[mid]} < ${target}. Eliminate left half.` };
            } else {
                high = mid - 1;
                yield { data: [...arr], highlights: [mid], activeRange: [low, high], line: 5, metrics:{comparisons}, narrative: `${arr[mid]} > ${target}. Eliminate right half.` };
            }
        }
        yield { data: [...arr], line: 7, narrative: "Target not found." };
    }
};