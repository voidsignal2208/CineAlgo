const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};

export const bubbleSort = {
    name: "Bubble Sort",
    complexity: {
        time: "O(n²)",
        space: "O(1)",
        stability: "Stable"
    },
    code: `procedure bubbleSort(A):
  n = length(A)
  for i = 0 to n - 1:
    for j = 0 to n - i - 1:
      if A[j] > A[j + 1]:
        swap(A[j], A[j + 1])`,
    funFact: "Bubble sort was first analyzed in 1956. While inefficient, it detects sorted lists in O(n).",
    run: function* (input) {
        let arr = [...input];
        let n = arr.length;
        let comparisons = 0;
        let swaps = 0;

        for (let i = 0; i < n; i++) {
            yield { 
                data: [...arr], 
                highlights: [], 
                line: 3,
                narrative: `Pass ${i+1}: Starting scan from beginning.` 
            };
            
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                comparisons++;
                yield { 
                    data: [...arr], 
                    highlights: [j, j+1], 
                    line: 5, 
                    metrics: { comparisons, swaps },
                    narrative: `Comparing indices ${j} (${arr[j]}) and ${j+1} (${arr[j+1]}).`
                };

                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                    swaps++;
                    swapped = true;
                    yield { 
                        data: [...arr], 
                        highlights: [j, j+1], 
                        line: 6, 
                        metrics: { comparisons, swaps },
                        narrative: `${arr[j+1]} > ${arr[j]}, swapping.`
                    };
                }
            }
            if (!swapped) break;
        }
        yield { 
            data: [...arr], 
            highlights: [], 
            line: -1, 
            metrics: { comparisons, swaps },
            narrative: "Array is fully sorted." 
        };
    }
};

export const selectionSort = {
    name: "Selection Sort",
    complexity: { time: "O(n²)", space: "O(1)", stability: "Unstable" },
    code: `procedure selectionSort(A):
  n = length(A)
  for i = 0 to n - 1:
    minIdx = i
    for j = i + 1 to n:
      if A[j] < A[minIdx]:
        minIdx = j
    swap(A[i], A[minIdx])`,
    funFact: "Selection sort makes the minimum possible number of swaps (n-1), useful when writing to memory is expensive.",
    run: function* (input) {
        let arr = [...input];
        let n = arr.length;
        let comparisons = 0;
        let swaps = 0;

        for (let i = 0; i < n; i++) {
            let minIdx = i;
            yield { data: [...arr], highlights: [i], line: 3, narrative: `Assuming minimum is at index ${i}.` };

            for (let j = i + 1; j < n; j++) {
                comparisons++;
                yield { 
                    data: [...arr], highlights: [minIdx, j], line: 5, metrics: {comparisons, swaps},
                    narrative: `Checking if ${arr[j]} < ${arr[minIdx]} (current min).`
                };

                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    yield { 
                        data: [...arr], highlights: [minIdx], line: 6, metrics: {comparisons, swaps},
                        narrative: `New minimum found at index ${j}.`
                    };
                }
            }
            if (minIdx !== i) {
                swap(arr, i, minIdx);
                swaps++;
                yield { 
                    data: [...arr], highlights: [i, minIdx], line: 7, metrics: {comparisons, swaps},
                    narrative: `Swapping found minimum ${arr[i]} with ${arr[minIdx]}.`
                };
            }
        }
        yield { data: [...arr], line: -1, narrative: "Sorted." };
    }
};

export const insertionSort = {
    name: "Insertion Sort",
    complexity: { time: "O(n²)", space: "O(1)", stability: "Stable" },
    code: `procedure insertionSort(A):
  for i = 1 to n - 1:
    key = A[i]
    j = i - 1
    while j >= 0 and A[j] > key:
      A[j + 1] = A[j]
      j = j - 1
    A[j + 1] = key`,
    funFact: "Insertion sort is extremely efficient for small datasets and 'almost sorted' arrays, used in Timsort.",
    run: function* (input) {
        let arr = [...input];
        let comparisons = 0;
        let writes = 0;

        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            yield { data: [...arr], highlights: [i], line: 3, narrative: `Selected key ${key} to insert.` };

            while (j >= 0) {
                comparisons++;
                yield { data: [...arr], highlights: [j, i], line: 5, metrics: {comparisons, writes}, narrative: `Comparing ${arr[j]} with key ${key}.` };
                
                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                    writes++;
                    yield { data: [...arr], highlights: [j+1], line: 6, metrics: {comparisons, writes}, narrative: `Moving ${arr[j]} forward.` };
                    j--;
                } else {
                    break;
                }
            }
            arr[j + 1] = key;
            writes++;
            yield { data: [...arr], highlights: [j+1], line: 8, metrics: {comparisons, writes}, narrative: `Inserted key ${key} at position ${j+1}.` };
        }
        yield { data: [...arr], line: -1, narrative: "Sorted." };
    }
};

export const quickSort = {
    name: "Quick Sort",
    complexity: { time: "O(n log n)", space: "O(log n)", stability: "Unstable" },
    code: `procedure quickSort(A, low, high):
  if low < high:
    pi = partition(A, low, high)
    quickSort(A, low, pi - 1)
    quickSort(A, pi + 1, high)

procedure partition(A, low, high):
  pivot = A[high]
  i = low - 1
  for j = low to high - 1:
    if A[j] < pivot:
      i++
      swap(A[i], A[j])
  swap(A[i + 1], A[high])
  return i + 1`,
    funFact: "Invented by Tony Hoare in 1959. The 'partition' logic is the heart of the algorithm.",
    run: function* (input) {
        let arr = [...input];
        let comparisons = 0;
        let swaps = 0;

        function* partition(low, high) {
            let pivot = arr[high];
            yield { data: [...arr], highlights: [high], line: 8, narrative: `Partitioning: Chosen pivot ${pivot} at index ${high}.` };
            
            let i = low - 1;
            for (let j = low; j < high; j++) {
                comparisons++;
                yield { data: [...arr], highlights: [j, high], line: 11, metrics: {comparisons, swaps}, narrative: `Comparing ${arr[j]} with pivot ${pivot}.` };
                
                if (arr[j] < pivot) {
                    i++;
                    swap(arr, i, j);
                    swaps++;
                    yield { data: [...arr], highlights: [i, j], line: 13, metrics: {comparisons, swaps}, narrative: `${arr[i]} < pivot, swapping to left partition.` };
                }
            }
            swap(arr, i + 1, high);
            swaps++;
            yield { data: [...arr], highlights: [i+1, high], line: 14, metrics: {comparisons, swaps}, narrative: `Placing pivot ${pivot} into correct sorted position.` };
            return i + 1;
        }

        function* qs(low, high) {
            if (low < high) {
                yield { data: [...arr], highlights: [low, high], line: 2, narrative: `Processing range [${low}, ${high}].` };
                let pi = yield* partition(low, high);
                yield* qs(low, pi - 1);
                yield* qs(pi + 1, high);
            }
        }

        yield* qs(0, arr.length - 1);
        yield { data: [...arr], line: -1, narrative: "Sorted." };
    }
};

export const heapSort = {
    name: "Heap Sort",
    complexity: { time: "O(n log n)", space: "O(1)", stability: "Unstable" },
    code: `procedure heapSort(A):
  n = length(A)
  // Build Max Heap
  for i = n/2 - 1 down to 0:
    heapify(A, n, i)
  // Extract elements
  for i = n - 1 down to 0:
    swap(A[0], A[i])
    heapify(A, i, 0)`,
    funFact: "Heap Sort guarantees O(n log n) even in worst case, unlike Quick Sort.",
    run: function* (input) {
        let arr = [...input];
        let n = arr.length;
        let comparisons = 0;
        let swaps = 0;

        function* heapify(n, i) {
            let largest = i;
            let left = 2 * i + 1;
            let right = 2 * i + 2;

            if (left < n) {
                comparisons++;
                if (arr[left] > arr[largest]) largest = left;
            }
            if (right < n) {
                comparisons++;
                if (arr[right] > arr[largest]) largest = right;
            }

            yield { data: [...arr], highlights: [i, left, right].filter(x => x < n), line: 5, metrics:{comparisons, swaps}, narrative: `Heapifying node ${i}. Checking children.` };

            if (largest !== i) {
                swap(arr, i, largest);
                swaps++;
                yield { data: [...arr], highlights: [i, largest], line: 8, metrics:{comparisons, swaps}, narrative: `Swapping ${arr[i]} with larger child ${arr[largest]}.` };
                yield* heapify(n, largest);
            }
        }

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            yield* heapify(n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            swap(arr, 0, i);
            swaps++;
            yield { data: [...arr], highlights: [0, i], line: 8, metrics:{comparisons, swaps}, narrative: `Moved max element ${arr[i]} to end.` };
            yield* heapify(i, 0);
        }

        yield { data: [...arr], line: -1, narrative: "Sorted." };
    }
};

export const mergeSort = {
    name: "Merge Sort",
    complexity: { time: "O(n log n)", space: "O(n)", stability: "Stable" },
    code: `procedure mergeSort(A, l, r):
  if l >= r: return
  m = l + (r - l) / 2
  mergeSort(A, l, m)
  mergeSort(A, m + 1, r)
  merge(A, l, m, r)`,
    funFact: "Merge Sort is preferred for sorting linked lists and external sorting (tape drives/disk) due to sequential access.",
    run: function* (input) {
        let arr = [...input];
        let operations = 0;

        function* merge(l, m, r) {
            let n1 = m - l + 1;
            let n2 = r - m;
            let L = arr.slice(l, m + 1);
            let R = arr.slice(m + 1, r + 1);
            
            let i = 0, j = 0, k = l;

            yield { data: [...arr], highlights: [], line: 6, narrative: `Merging subarrays [${l}..${m}] and [${m+1}..${r}].` };

            while (i < n1 && j < n2) {
                operations++;
                if (L[i] <= R[j]) {
                    arr[k] = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    j++;
                }
                yield { 
                    data: [...arr], highlights: [k], line: 6, metrics: { access: operations },
                    narrative: `Placed ${arr[k]} into merged position ${k}.` 
                };
                k++;
            }

            while (i < n1) {
                arr[k] = L[i];
                i++; k++; operations++;
                yield { data: [...arr], highlights: [k-1], line: 6, metrics: {access: operations}, narrative: "Flushing remaining left elements."};
            }
            while (j < n2) {
                arr[k] = R[j];
                j++; k++; operations++;
                yield { data: [...arr], highlights: [k-1], line: 6, metrics: {access: operations}, narrative: "Flushing remaining right elements."};
            }
        }

        function* sort(l, r) {
            if (l >= r) return;
            let m = l + Math.floor((r - l) / 2);
            yield* sort(l, m);
            yield* sort(m + 1, r);
            yield* merge(l, m, r);
        }

        yield* sort(0, arr.length - 1);
        yield { data: [...arr], line: -1, narrative: "Sorted." };
    }
};