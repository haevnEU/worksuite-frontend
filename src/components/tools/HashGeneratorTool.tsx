import React, { useState } from "react";
import { Check, Copy, Hash, ShieldCheck } from "lucide-react";

const generateCryptoHash = async (
  text: string,
  algorithm: "SHA-256" | "SHA-512",
): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const md5 = (string: string): string => {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function G(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function H(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function I(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }
  function FF(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  const utf8 = unescape(encodeURIComponent(string));
  const x = Array<number>();
  for (let i = 0; i < utf8.length * 8; i += 8) {
    x[i >> 5] |= (utf8.charCodeAt(i / 8) & 0xff) << (i % 32);
  }
  const lWordCount = x.length;
  const lNumberOfWordsTempOne = ((utf8.length + 8) >> 6) + 1;
  const lNumberOfWordsTempTwo = lNumberOfWordsTempOne * 16;
  const lWordArray = Array<number>(lNumberOfWordsTempTwo - 1);
  for (let i = 0; i < lWordCount; i++) lWordArray[i] = x[i] || 0;
  for (let i = lWordCount; i < lNumberOfWordsTempTwo; i++) lWordArray[i] = 0;
  lWordArray[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) * 8);
  lWordArray[lNumberOfWordsTempTwo - 2] = utf8.length * 8;

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < lWordArray.length; k += 16) {
    const AA = a;
    const BB = b;
    const CC = c;
    const DD = d;
    a = FF(a, b, c, d, lWordArray[k + 0], 7, 0xd76aa478);
    d = FF(d, a, b, c, lWordArray[k + 1], 12, 0xe8c7b756);
    c = FF(c, d, a, b, lWordArray[k + 2], 17, 0x242070db);
    b = FF(b, c, d, a, lWordArray[k + 3], 22, 0xc1bdceee);
    a = FF(a, b, c, d, lWordArray[k + 4], 7, 0xf57c0faf);
    d = FF(d, a, b, c, lWordArray[k + 5], 12, 0x4787c62a);
    c = FF(c, d, a, b, lWordArray[k + 6], 17, 0xa8304613);
    b = FF(b, c, d, a, lWordArray[k + 7], 22, 0xfd469501);
    a = FF(a, b, c, d, lWordArray[k + 8], 7, 0x698098d8);
    d = FF(d, a, b, c, lWordArray[k + 9], 12, 0x8b44f7af);
    c = FF(c, d, a, b, lWordArray[k + 10], 17, 0xffff5bb1);
    b = FF(b, c, d, a, lWordArray[k + 11], 22, 0x895cd7be);
    a = FF(a, b, c, d, lWordArray[k + 12], 7, 0x6b901122);
    d = FF(d, a, b, c, lWordArray[k + 13], 12, 0xfd987193);
    c = FF(c, d, a, b, lWordArray[k + 14], 17, 0xa679438e);
    b = FF(b, c, d, a, lWordArray[k + 15], 22, 0x49b40821);

    a = GG(a, b, c, d, lWordArray[k + 1], 5, 0xf61e2562);
    d = GG(d, a, b, c, lWordArray[k + 6], 9, 0xc040b340);
    c = GG(c, d, a, b, lWordArray[k + 11], 14, 0x265e5a51);
    b = GG(b, c, d, a, lWordArray[k + 0], 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, lWordArray[k + 5], 5, 0xd62f105d);
    d = GG(d, a, b, c, lWordArray[k + 10], 9, 0x02441453);
    c = GG(c, d, a, b, lWordArray[k + 15], 14, 0xd8a1e681);
    b = GG(b, c, d, a, lWordArray[k + 4], 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, lWordArray[k + 9], 5, 0x21e1cde6);
    d = GG(d, a, b, c, lWordArray[k + 14], 9, 0xc33707d6);
    c = GG(c, d, a, b, lWordArray[k + 3], 14, 0xf4d50d87);
    b = GG(b, c, d, a, lWordArray[k + 8], 20, 0x455a14ed);
    a = GG(a, b, c, d, lWordArray[k + 13], 5, 0xa9e3e905);
    d = GG(d, a, b, c, lWordArray[k + 2], 9, 0xfcefa3f8);
    c = GG(c, d, a, b, lWordArray[k + 7], 14, 0x676f02d9);
    b = GG(b, c, d, a, lWordArray[k + 12], 20, 0x8d2a4c8a);

    a = HH(a, b, c, d, lWordArray[k + 5], 4, 0xfffa3942);
    d = HH(d, a, b, c, lWordArray[k + 8], 11, 0x8771f681);
    c = HH(c, d, a, b, lWordArray[k + 11], 16, 0x6d9d6122);
    b = HH(b, c, d, a, lWordArray[k + 14], 23, 0xfde5380c);
    a = HH(a, b, c, d, lWordArray[k + 1], 4, 0xa4beea44);
    d = HH(d, a, b, c, lWordArray[k + 4], 11, 0x4bdecfa9);
    c = HH(c, d, a, b, lWordArray[k + 7], 16, 0xf6bb4b60);
    b = HH(b, c, d, a, lWordArray[k + 10], 23, 0xbebfbc70);
    a = HH(a, b, c, d, lWordArray[k + 13], 4, 0x289b7ec6);
    d = HH(d, a, b, c, lWordArray[k + 0], 11, 0xeaa127fa);
    c = HH(c, d, a, b, lWordArray[k + 3], 16, 0xd4ef3085);
    b = HH(b, c, d, a, lWordArray[k + 6], 23, 0x04881d05);
    a = HH(a, b, c, d, lWordArray[k + 9], 4, 0xd9d4d039);
    d = HH(d, a, b, c, lWordArray[k + 12], 11, 0xe6db99e5);
    c = HH(c, d, a, b, lWordArray[k + 15], 16, 0x1fa27cf8);
    b = HH(b, c, d, a, lWordArray[k + 2], 23, 0xc4ac5665);

    a = II(a, b, c, d, lWordArray[k + 0], 6, 0xf4292244);
    d = II(d, a, b, c, lWordArray[k + 7], 10, 0x432aff97);
    c = II(c, d, a, b, lWordArray[k + 14], 15, 0xab9423a7);
    b = II(b, c, d, a, lWordArray[k + 5], 21, 0xfc93a039);
    a = II(a, b, c, d, lWordArray[k + 12], 6, 0x655b59c3);
    d = II(d, a, b, c, lWordArray[k + 3], 10, 0x8f0ccc92);
    c = II(c, d, a, b, lWordArray[k + 10], 15, 0xffeff47d);
    b = II(b, c, d, a, lWordArray[k + 1], 21, 0x85845dd1);
    a = II(a, b, c, d, lWordArray[k + 8], 6, 0x6fa87e4f);
    d = II(d, a, b, c, lWordArray[k + 15], 10, 0xfe2ce6e0);
    c = II(c, d, a, b, lWordArray[k + 6], 15, 0xa3014314);
    b = II(b, c, d, a, lWordArray[k + 13], 21, 0x4e0811a1);
    a = II(a, b, c, d, lWordArray[k + 4], 6, 0xf7537e82);
    d = II(d, a, b, c, lWordArray[k + 11], 10, 0xbd3af235);
    c = II(c, d, a, b, lWordArray[k + 2], 15, 0x2ad7d2bb);
    b = II(b, c, d, a, lWordArray[k + 9], 21, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  function wordToHex(lValue: number) {
    let wordToHexValue = "";
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = (lValue >>> (lCount * 8)) & 255;
      const wordToHexValueTemp = "0" + lByte.toString(16);
      wordToHexValue += wordToHexValueTemp.substr(
        wordToHexValueTemp.length - 2,
        2,
      );
    }
    return wordToHexValue;
  }
  return (
    wordToHex(a) +
    wordToHex(b) +
    wordToHex(c) +
    wordToHex(d)
  ).toLowerCase();
};

export const HashGeneratorTool: React.FC = () => {
  const [input, setInput] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [hashes, setHashes] = useState({ md5: "", sha256: "", sha512: "" });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCalculate = async (val: string) => {
    setInput(val);
    if (!val) {
      setHashes({ md5: "", sha256: "", sha512: "" });
      return;
    }

    const sha256 = await generateCryptoHash(val, "SHA-256");
    const sha512 = await generateCryptoHash(val, "SHA-512");
    const md5Hash = md5(val);

    setHashes({ md5: md5Hash, sha256, sha512 });
  };

  const copyValue = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isMatched = (hashVal: string) => {
    return (
      compareHash.trim().length > 0 &&
      hashVal.toLowerCase() === compareHash.trim().toLowerCase()
    );
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Hash className="w-4 h-4 text-emerald-400" />
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          Checksum & Hash Generator (MD5, SHA-256, SHA-512)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">
            Input String
          </label>
          <textarea
            rows={3}
            value={input}
            placeholder="Type text to generate hashes..."
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-xs font-mono resize-none transition"
            onChange={(e) => handleCalculate(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">
            Compare / Verify Checksum (optional)
          </label>
          <input
            type="text"
            value={compareHash}
            placeholder="Paste checksum here to compare match..."
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 transition"
            onChange={(e) => setCompareHash(e.target.value)}
          />
          {compareHash && (
            <span className="text-[11px] flex items-center gap-1 text-slate-400 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Matches will
              be highlighted below in green.
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {(["md5", "sha256", "sha512"] as const).map((algo) => {
          const val = hashes[algo];
          const matched = isMatched(val);

          return (
            <div
              key={algo}
              className={`p-3.5 rounded-xl border transition-all ${
                matched
                  ? "bg-emerald-950/30 border-emerald-500/60"
                  : "bg-[#0b111e] border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {algo.toUpperCase()}
                </span>
                {val && (
                  <button
                    type="button"
                    onClick={() => copyValue(val, algo)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-sans cursor-pointer"
                  >
                    {copiedKey === algo ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === algo ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
              <div className="font-mono text-xs text-slate-200 break-all select-all">
                {val || <span className="text-slate-600 italic">No input</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
