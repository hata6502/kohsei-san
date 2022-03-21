/*! For license information please see index.js.LICENSE.txt */
var t = {
    629: (t) => {
      function e(t) {
        return !0;
      }
      t.exports = function (t, n) {
        var r = [];
        n = n || e;
        do {
          r.push(t), (t = t.parentNode);
        } while (t && t.tagName && n(t));
        return r.slice(1);
      };
    },
    658: (t) => {
      var e = function () {
          (this.Diff_Timeout = 1),
            (this.Diff_EditCost = 4),
            (this.Match_Threshold = 0.5),
            (this.Match_Distance = 1e3),
            (this.Patch_DeleteThreshold = 0.5),
            (this.Patch_Margin = 4),
            (this.Match_MaxBits = 32);
        },
        n = -1;
      (e.Diff = function (t, e) {
        return [t, e];
      }),
        (e.prototype.diff_main = function (t, n, r, i) {
          void 0 === i &&
            (i =
              this.Diff_Timeout <= 0
                ? Number.MAX_VALUE
                : new Date().getTime() + 1e3 * this.Diff_Timeout);
          var f = i;
          if (null == t || null == n) throw new Error('Null input. (diff_main)');
          if (t == n) return t ? [new e.Diff(0, t)] : [];
          void 0 === r && (r = !0);
          var s = r,
            o = this.diff_commonPrefix(t, n),
            a = t.substring(0, o);
          (t = t.substring(o)), (n = n.substring(o)), (o = this.diff_commonSuffix(t, n));
          var h = t.substring(t.length - o);
          (t = t.substring(0, t.length - o)), (n = n.substring(0, n.length - o));
          var l = this.diff_compute_(t, n, s, f);
          return (
            a && l.unshift(new e.Diff(0, a)),
            h && l.push(new e.Diff(0, h)),
            this.diff_cleanupMerge(l),
            l
          );
        }),
        (e.prototype.diff_compute_ = function (t, r, i, f) {
          var s;
          if (!t) return [new e.Diff(1, r)];
          if (!r) return [new e.Diff(n, t)];
          var o = t.length > r.length ? t : r,
            a = t.length > r.length ? r : t,
            h = o.indexOf(a);
          if (-1 != h)
            return (
              (s = [
                new e.Diff(1, o.substring(0, h)),
                new e.Diff(0, a),
                new e.Diff(1, o.substring(h + a.length)),
              ]),
              t.length > r.length && (s[0][0] = s[2][0] = n),
              s
            );
          if (1 == a.length) return [new e.Diff(n, t), new e.Diff(1, r)];
          var l = this.diff_halfMatch_(t, r);
          if (l) {
            var u = l[0],
              g = l[1],
              c = l[2],
              d = l[3],
              p = l[4],
              _ = this.diff_main(u, c, i, f),
              v = this.diff_main(g, d, i, f);
            return _.concat([new e.Diff(0, p)], v);
          }
          return i && t.length > 100 && r.length > 100
            ? this.diff_lineMode_(t, r, f)
            : this.diff_bisect_(t, r, f);
        }),
        (e.prototype.diff_lineMode_ = function (t, r, i) {
          var f = this.diff_linesToChars_(t, r);
          (t = f.chars1), (r = f.chars2);
          var s = f.lineArray,
            o = this.diff_main(t, r, !1, i);
          this.diff_charsToLines_(o, s), this.diff_cleanupSemantic(o), o.push(new e.Diff(0, ''));
          for (var a = 0, h = 0, l = 0, u = '', g = ''; a < o.length; ) {
            switch (o[a][0]) {
              case 1:
                l++, (g += o[a][1]);
                break;
              case n:
                h++, (u += o[a][1]);
                break;
              case 0:
                if (h >= 1 && l >= 1) {
                  o.splice(a - h - l, h + l), (a = a - h - l);
                  for (var c = this.diff_main(u, g, !1, i), d = c.length - 1; d >= 0; d--)
                    o.splice(a, 0, c[d]);
                  a += c.length;
                }
                (l = 0), (h = 0), (u = ''), (g = '');
            }
            a++;
          }
          return o.pop(), o;
        }),
        (e.prototype.diff_bisect_ = function (t, r, i) {
          for (
            var f = t.length,
              s = r.length,
              o = Math.ceil((f + s) / 2),
              a = o,
              h = 2 * o,
              l = new Array(h),
              u = new Array(h),
              g = 0;
            g < h;
            g++
          )
            (l[g] = -1), (u[g] = -1);
          (l[a + 1] = 0), (u[a + 1] = 0);
          for (
            var c = f - s, d = c % 2 != 0, p = 0, _ = 0, v = 0, m = 0, b = 0;
            b < o && !(new Date().getTime() > i);
            b++
          ) {
            for (var w = -b + p; w <= b - _; w += 2) {
              for (
                var x = a + w,
                  M =
                    (C = w == -b || (w != b && l[x - 1] < l[x + 1]) ? l[x + 1] : l[x - 1] + 1) - w;
                C < f && M < s && t.charAt(C) == r.charAt(M);

              )
                C++, M++;
              if (((l[x] = C), C > f)) _ += 2;
              else if (M > s) p += 2;
              else if (d && (D = a + c - w) >= 0 && D < h && -1 != u[D] && C >= (N = f - u[D]))
                return this.diff_bisectSplit_(t, r, C, M, i);
            }
            for (var y = -b + v; y <= b - m; y += 2) {
              for (
                var N,
                  D = a + y,
                  E =
                    (N = y == -b || (y != b && u[D - 1] < u[D + 1]) ? u[D + 1] : u[D - 1] + 1) - y;
                N < f && E < s && t.charAt(f - N - 1) == r.charAt(s - E - 1);

              )
                N++, E++;
              if (((u[D] = N), N > f)) m += 2;
              else if (E > s) v += 2;
              else if (!d) {
                var C;
                if ((x = a + c - y) >= 0 && x < h && -1 != l[x])
                  if (((M = a + (C = l[x]) - x), C >= (N = f - N)))
                    return this.diff_bisectSplit_(t, r, C, M, i);
              }
            }
          }
          return [new e.Diff(n, t), new e.Diff(1, r)];
        }),
        (e.prototype.diff_bisectSplit_ = function (t, e, n, r, i) {
          var f = t.substring(0, n),
            s = e.substring(0, r),
            o = t.substring(n),
            a = e.substring(r),
            h = this.diff_main(f, s, !1, i),
            l = this.diff_main(o, a, !1, i);
          return h.concat(l);
        }),
        (e.prototype.diff_linesToChars_ = function (t, e) {
          var n = [],
            r = {};
          function i(t) {
            for (var e = '', i = 0, s = -1, o = n.length; s < t.length - 1; ) {
              -1 == (s = t.indexOf('\n', i)) && (s = t.length - 1);
              var a = t.substring(i, s + 1);
              (r.hasOwnProperty ? r.hasOwnProperty(a) : void 0 !== r[a])
                ? (e += String.fromCharCode(r[a]))
                : (o == f && ((a = t.substring(i)), (s = t.length)),
                  (e += String.fromCharCode(o)),
                  (r[a] = o),
                  (n[o++] = a)),
                (i = s + 1);
            }
            return e;
          }
          n[0] = '';
          var f = 4e4,
            s = i(t);
          return (f = 65535), { chars1: s, chars2: i(e), lineArray: n };
        }),
        (e.prototype.diff_charsToLines_ = function (t, e) {
          for (var n = 0; n < t.length; n++) {
            for (var r = t[n][1], i = [], f = 0; f < r.length; f++) i[f] = e[r.charCodeAt(f)];
            t[n][1] = i.join('');
          }
        }),
        (e.prototype.diff_commonPrefix = function (t, e) {
          if (!t || !e || t.charAt(0) != e.charAt(0)) return 0;
          for (var n = 0, r = Math.min(t.length, e.length), i = r, f = 0; n < i; )
            t.substring(f, i) == e.substring(f, i) ? (f = n = i) : (r = i),
              (i = Math.floor((r - n) / 2 + n));
          return i;
        }),
        (e.prototype.diff_commonSuffix = function (t, e) {
          if (!t || !e || t.charAt(t.length - 1) != e.charAt(e.length - 1)) return 0;
          for (var n = 0, r = Math.min(t.length, e.length), i = r, f = 0; n < i; )
            t.substring(t.length - i, t.length - f) == e.substring(e.length - i, e.length - f)
              ? (f = n = i)
              : (r = i),
              (i = Math.floor((r - n) / 2 + n));
          return i;
        }),
        (e.prototype.diff_commonOverlap_ = function (t, e) {
          var n = t.length,
            r = e.length;
          if (0 == n || 0 == r) return 0;
          n > r ? (t = t.substring(n - r)) : n < r && (e = e.substring(0, n));
          var i = Math.min(n, r);
          if (t == e) return i;
          for (var f = 0, s = 1; ; ) {
            var o = t.substring(i - s),
              a = e.indexOf(o);
            if (-1 == a) return f;
            (s += a), (0 != a && t.substring(i - s) != e.substring(0, s)) || ((f = s), s++);
          }
        }),
        (e.prototype.diff_halfMatch_ = function (t, e) {
          if (this.Diff_Timeout <= 0) return null;
          var n = t.length > e.length ? t : e,
            r = t.length > e.length ? e : t;
          if (n.length < 4 || 2 * r.length < n.length) return null;
          var i = this;
          function f(t, e, n) {
            for (
              var r, f, s, o, a = t.substring(n, n + Math.floor(t.length / 4)), h = -1, l = '';
              -1 != (h = e.indexOf(a, h + 1));

            ) {
              var u = i.diff_commonPrefix(t.substring(n), e.substring(h)),
                g = i.diff_commonSuffix(t.substring(0, n), e.substring(0, h));
              l.length < g + u &&
                ((l = e.substring(h - g, h) + e.substring(h, h + u)),
                (r = t.substring(0, n - g)),
                (f = t.substring(n + u)),
                (s = e.substring(0, h - g)),
                (o = e.substring(h + u)));
            }
            return 2 * l.length >= t.length ? [r, f, s, o, l] : null;
          }
          var s,
            o,
            a,
            h,
            l,
            u = f(n, r, Math.ceil(n.length / 4)),
            g = f(n, r, Math.ceil(n.length / 2));
          return u || g
            ? ((s = g ? (u && u[4].length > g[4].length ? u : g) : u),
              t.length > e.length
                ? ((o = s[0]), (a = s[1]), (h = s[2]), (l = s[3]))
                : ((h = s[0]), (l = s[1]), (o = s[2]), (a = s[3])),
              [o, a, h, l, s[4]])
            : null;
        }),
        (e.prototype.diff_cleanupSemantic = function (t) {
          for (
            var r = !1, i = [], f = 0, s = null, o = 0, a = 0, h = 0, l = 0, u = 0;
            o < t.length;

          )
            0 == t[o][0]
              ? ((i[f++] = o), (a = l), (h = u), (l = 0), (u = 0), (s = t[o][1]))
              : (1 == t[o][0] ? (l += t[o][1].length) : (u += t[o][1].length),
                s &&
                  s.length <= Math.max(a, h) &&
                  s.length <= Math.max(l, u) &&
                  (t.splice(i[f - 1], 0, new e.Diff(n, s)),
                  (t[i[f - 1] + 1][0] = 1),
                  f--,
                  (o = --f > 0 ? i[f - 1] : -1),
                  (a = 0),
                  (h = 0),
                  (l = 0),
                  (u = 0),
                  (s = null),
                  (r = !0))),
              o++;
          for (
            r && this.diff_cleanupMerge(t), this.diff_cleanupSemanticLossless(t), o = 1;
            o < t.length;

          ) {
            if (t[o - 1][0] == n && 1 == t[o][0]) {
              var g = t[o - 1][1],
                c = t[o][1],
                d = this.diff_commonOverlap_(g, c),
                p = this.diff_commonOverlap_(c, g);
              d >= p
                ? (d >= g.length / 2 || d >= c.length / 2) &&
                  (t.splice(o, 0, new e.Diff(0, c.substring(0, d))),
                  (t[o - 1][1] = g.substring(0, g.length - d)),
                  (t[o + 1][1] = c.substring(d)),
                  o++)
                : (p >= g.length / 2 || p >= c.length / 2) &&
                  (t.splice(o, 0, new e.Diff(0, g.substring(0, p))),
                  (t[o - 1][0] = 1),
                  (t[o - 1][1] = c.substring(0, c.length - p)),
                  (t[o + 1][0] = n),
                  (t[o + 1][1] = g.substring(p)),
                  o++),
                o++;
            }
            o++;
          }
        }),
        (e.prototype.diff_cleanupSemanticLossless = function (t) {
          function n(t, n) {
            if (!t || !n) return 6;
            var r = t.charAt(t.length - 1),
              i = n.charAt(0),
              f = r.match(e.nonAlphaNumericRegex_),
              s = i.match(e.nonAlphaNumericRegex_),
              o = f && r.match(e.whitespaceRegex_),
              a = s && i.match(e.whitespaceRegex_),
              h = o && r.match(e.linebreakRegex_),
              l = a && i.match(e.linebreakRegex_),
              u = h && t.match(e.blanklineEndRegex_),
              g = l && n.match(e.blanklineStartRegex_);
            return u || g ? 5 : h || l ? 4 : f && !o && a ? 3 : o || a ? 2 : f || s ? 1 : 0;
          }
          for (var r = 1; r < t.length - 1; ) {
            if (0 == t[r - 1][0] && 0 == t[r + 1][0]) {
              var i = t[r - 1][1],
                f = t[r][1],
                s = t[r + 1][1],
                o = this.diff_commonSuffix(i, f);
              if (o) {
                var a = f.substring(f.length - o);
                (i = i.substring(0, i.length - o)),
                  (f = a + f.substring(0, f.length - o)),
                  (s = a + s);
              }
              for (var h = i, l = f, u = s, g = n(i, f) + n(f, s); f.charAt(0) === s.charAt(0); ) {
                (i += f.charAt(0)), (f = f.substring(1) + s.charAt(0)), (s = s.substring(1));
                var c = n(i, f) + n(f, s);
                c >= g && ((g = c), (h = i), (l = f), (u = s));
              }
              t[r - 1][1] != h &&
                (h ? (t[r - 1][1] = h) : (t.splice(r - 1, 1), r--),
                (t[r][1] = l),
                u ? (t[r + 1][1] = u) : (t.splice(r + 1, 1), r--));
            }
            r++;
          }
        }),
        (e.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/),
        (e.whitespaceRegex_ = /\s/),
        (e.linebreakRegex_ = /[\r\n]/),
        (e.blanklineEndRegex_ = /\n\r?\n$/),
        (e.blanklineStartRegex_ = /^\r?\n\r?\n/),
        (e.prototype.diff_cleanupEfficiency = function (t) {
          for (
            var r = !1, i = [], f = 0, s = null, o = 0, a = !1, h = !1, l = !1, u = !1;
            o < t.length;

          )
            0 == t[o][0]
              ? (t[o][1].length < this.Diff_EditCost && (l || u)
                  ? ((i[f++] = o), (a = l), (h = u), (s = t[o][1]))
                  : ((f = 0), (s = null)),
                (l = u = !1))
              : (t[o][0] == n ? (u = !0) : (l = !0),
                s &&
                  ((a && h && l && u) ||
                    (s.length < this.Diff_EditCost / 2 && a + h + l + u == 3)) &&
                  (t.splice(i[f - 1], 0, new e.Diff(n, s)),
                  (t[i[f - 1] + 1][0] = 1),
                  f--,
                  (s = null),
                  a && h ? ((l = u = !0), (f = 0)) : ((o = --f > 0 ? i[f - 1] : -1), (l = u = !1)),
                  (r = !0))),
              o++;
          r && this.diff_cleanupMerge(t);
        }),
        (e.prototype.diff_cleanupMerge = function (t) {
          t.push(new e.Diff(0, ''));
          for (var r, i = 0, f = 0, s = 0, o = '', a = ''; i < t.length; )
            switch (t[i][0]) {
              case 1:
                s++, (a += t[i][1]), i++;
                break;
              case n:
                f++, (o += t[i][1]), i++;
                break;
              case 0:
                f + s > 1
                  ? (0 !== f &&
                      0 !== s &&
                      (0 !== (r = this.diff_commonPrefix(a, o)) &&
                        (i - f - s > 0 && 0 == t[i - f - s - 1][0]
                          ? (t[i - f - s - 1][1] += a.substring(0, r))
                          : (t.splice(0, 0, new e.Diff(0, a.substring(0, r))), i++),
                        (a = a.substring(r)),
                        (o = o.substring(r))),
                      0 !== (r = this.diff_commonSuffix(a, o)) &&
                        ((t[i][1] = a.substring(a.length - r) + t[i][1]),
                        (a = a.substring(0, a.length - r)),
                        (o = o.substring(0, o.length - r)))),
                    (i -= f + s),
                    t.splice(i, f + s),
                    o.length && (t.splice(i, 0, new e.Diff(n, o)), i++),
                    a.length && (t.splice(i, 0, new e.Diff(1, a)), i++),
                    i++)
                  : 0 !== i && 0 == t[i - 1][0]
                  ? ((t[i - 1][1] += t[i][1]), t.splice(i, 1))
                  : i++,
                  (s = 0),
                  (f = 0),
                  (o = ''),
                  (a = '');
            }
          '' === t[t.length - 1][1] && t.pop();
          var h = !1;
          for (i = 1; i < t.length - 1; )
            0 == t[i - 1][0] &&
              0 == t[i + 1][0] &&
              (t[i][1].substring(t[i][1].length - t[i - 1][1].length) == t[i - 1][1]
                ? ((t[i][1] =
                    t[i - 1][1] + t[i][1].substring(0, t[i][1].length - t[i - 1][1].length)),
                  (t[i + 1][1] = t[i - 1][1] + t[i + 1][1]),
                  t.splice(i - 1, 1),
                  (h = !0))
                : t[i][1].substring(0, t[i + 1][1].length) == t[i + 1][1] &&
                  ((t[i - 1][1] += t[i + 1][1]),
                  (t[i][1] = t[i][1].substring(t[i + 1][1].length) + t[i + 1][1]),
                  t.splice(i + 1, 1),
                  (h = !0))),
              i++;
          h && this.diff_cleanupMerge(t);
        }),
        (e.prototype.diff_xIndex = function (t, e) {
          var r,
            i = 0,
            f = 0,
            s = 0,
            o = 0;
          for (
            r = 0;
            r < t.length &&
            (1 !== t[r][0] && (i += t[r][1].length),
            t[r][0] !== n && (f += t[r][1].length),
            !(i > e));
            r++
          )
            (s = i), (o = f);
          return t.length != r && t[r][0] === n ? o : o + (e - s);
        }),
        (e.prototype.diff_prettyHtml = function (t) {
          for (var e = [], r = /&/g, i = /</g, f = />/g, s = /\n/g, o = 0; o < t.length; o++) {
            var a = t[o][0],
              h = t[o][1]
                .replace(r, '&amp;')
                .replace(i, '&lt;')
                .replace(f, '&gt;')
                .replace(s, '&para;<br>');
            switch (a) {
              case 1:
                e[o] = '<ins style="background:#e6ffe6;">' + h + '</ins>';
                break;
              case n:
                e[o] = '<del style="background:#ffe6e6;">' + h + '</del>';
                break;
              case 0:
                e[o] = '<span>' + h + '</span>';
            }
          }
          return e.join('');
        }),
        (e.prototype.diff_text1 = function (t) {
          for (var e = [], n = 0; n < t.length; n++) 1 !== t[n][0] && (e[n] = t[n][1]);
          return e.join('');
        }),
        (e.prototype.diff_text2 = function (t) {
          for (var e = [], r = 0; r < t.length; r++) t[r][0] !== n && (e[r] = t[r][1]);
          return e.join('');
        }),
        (e.prototype.diff_levenshtein = function (t) {
          for (var e = 0, r = 0, i = 0, f = 0; f < t.length; f++) {
            var s = t[f][0],
              o = t[f][1];
            switch (s) {
              case 1:
                r += o.length;
                break;
              case n:
                i += o.length;
                break;
              case 0:
                (e += Math.max(r, i)), (r = 0), (i = 0);
            }
          }
          return e + Math.max(r, i);
        }),
        (e.prototype.diff_toDelta = function (t) {
          for (var e = [], r = 0; r < t.length; r++)
            switch (t[r][0]) {
              case 1:
                e[r] = '+' + encodeURI(t[r][1]);
                break;
              case n:
                e[r] = '-' + t[r][1].length;
                break;
              case 0:
                e[r] = '=' + t[r][1].length;
            }
          return e.join('\t').replace(/%20/g, ' ');
        }),
        (e.prototype.diff_fromDelta = function (t, r) {
          for (var i = [], f = 0, s = 0, o = r.split(/\t/g), a = 0; a < o.length; a++) {
            var h = o[a].substring(1);
            switch (o[a].charAt(0)) {
              case '+':
                try {
                  i[f++] = new e.Diff(1, decodeURI(h));
                } catch (t) {
                  throw new Error('Illegal escape in diff_fromDelta: ' + h);
                }
                break;
              case '-':
              case '=':
                var l = parseInt(h, 10);
                if (isNaN(l) || l < 0) throw new Error('Invalid number in diff_fromDelta: ' + h);
                var u = t.substring(s, (s += l));
                '=' == o[a].charAt(0) ? (i[f++] = new e.Diff(0, u)) : (i[f++] = new e.Diff(n, u));
                break;
              default:
                if (o[a]) throw new Error('Invalid diff operation in diff_fromDelta: ' + o[a]);
            }
          }
          if (s != t.length)
            throw new Error(
              'Delta length (' + s + ') does not equal source text length (' + t.length + ').'
            );
          return i;
        }),
        (e.prototype.match_main = function (t, e, n) {
          if (null == t || null == e || null == n) throw new Error('Null input. (match_main)');
          return (
            (n = Math.max(0, Math.min(n, t.length))),
            t == e
              ? 0
              : t.length
              ? t.substring(n, n + e.length) == e
                ? n
                : this.match_bitap_(t, e, n)
              : -1
          );
        }),
        (e.prototype.match_bitap_ = function (t, e, n) {
          if (e.length > this.Match_MaxBits) throw new Error('Pattern too long for this browser.');
          var r = this.match_alphabet_(e),
            i = this;
          function f(t, r) {
            var f = t / e.length,
              s = Math.abs(n - r);
            return i.Match_Distance ? f + s / i.Match_Distance : s ? 1 : f;
          }
          var s = this.Match_Threshold,
            o = t.indexOf(e, n);
          -1 != o &&
            ((s = Math.min(f(0, o), s)),
            -1 != (o = t.lastIndexOf(e, n + e.length)) && (s = Math.min(f(0, o), s)));
          var a,
            h,
            l = 1 << (e.length - 1);
          o = -1;
          for (var u, g = e.length + t.length, c = 0; c < e.length; c++) {
            for (a = 0, h = g; a < h; )
              f(c, n + h) <= s ? (a = h) : (g = h), (h = Math.floor((g - a) / 2 + a));
            g = h;
            var d = Math.max(1, n - h + 1),
              p = Math.min(n + h, t.length) + e.length,
              _ = Array(p + 2);
            _[p + 1] = (1 << c) - 1;
            for (var v = p; v >= d; v--) {
              var m = r[t.charAt(v - 1)];
              if (
                ((_[v] =
                  0 === c
                    ? ((_[v + 1] << 1) | 1) & m
                    : (((_[v + 1] << 1) | 1) & m) | ((u[v + 1] | u[v]) << 1) | 1 | u[v + 1]),
                _[v] & l)
              ) {
                var b = f(c, v - 1);
                if (b <= s) {
                  if (((s = b), !((o = v - 1) > n))) break;
                  d = Math.max(1, 2 * n - o);
                }
              }
            }
            if (f(c + 1, n) > s) break;
            u = _;
          }
          return o;
        }),
        (e.prototype.match_alphabet_ = function (t) {
          for (var e = {}, n = 0; n < t.length; n++) e[t.charAt(n)] = 0;
          for (n = 0; n < t.length; n++) e[t.charAt(n)] |= 1 << (t.length - n - 1);
          return e;
        }),
        (e.prototype.patch_addContext_ = function (t, n) {
          if (0 != n.length) {
            if (null === t.start2) throw Error('patch not initialized');
            for (
              var r = n.substring(t.start2, t.start2 + t.length1), i = 0;
              n.indexOf(r) != n.lastIndexOf(r) &&
              r.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin;

            )
              (i += this.Patch_Margin), (r = n.substring(t.start2 - i, t.start2 + t.length1 + i));
            i += this.Patch_Margin;
            var f = n.substring(t.start2 - i, t.start2);
            f && t.diffs.unshift(new e.Diff(0, f));
            var s = n.substring(t.start2 + t.length1, t.start2 + t.length1 + i);
            s && t.diffs.push(new e.Diff(0, s)),
              (t.start1 -= f.length),
              (t.start2 -= f.length),
              (t.length1 += f.length + s.length),
              (t.length2 += f.length + s.length);
          }
        }),
        (e.prototype.patch_make = function (t, r, i) {
          var f, s;
          if ('string' == typeof t && 'string' == typeof r && void 0 === i)
            (f = t),
              (s = this.diff_main(f, r, !0)).length > 2 &&
                (this.diff_cleanupSemantic(s), this.diff_cleanupEfficiency(s));
          else if (t && 'object' == typeof t && void 0 === r && void 0 === i)
            (s = t), (f = this.diff_text1(s));
          else if ('string' == typeof t && r && 'object' == typeof r && void 0 === i)
            (f = t), (s = r);
          else {
            if ('string' != typeof t || 'string' != typeof r || !i || 'object' != typeof i)
              throw new Error('Unknown call format to patch_make.');
            (f = t), (s = i);
          }
          if (0 === s.length) return [];
          for (
            var o = [], a = new e.patch_obj(), h = 0, l = 0, u = 0, g = f, c = f, d = 0;
            d < s.length;
            d++
          ) {
            var p = s[d][0],
              _ = s[d][1];
            switch ((h || 0 === p || ((a.start1 = l), (a.start2 = u)), p)) {
              case 1:
                (a.diffs[h++] = s[d]),
                  (a.length2 += _.length),
                  (c = c.substring(0, u) + _ + c.substring(u));
                break;
              case n:
                (a.length1 += _.length),
                  (a.diffs[h++] = s[d]),
                  (c = c.substring(0, u) + c.substring(u + _.length));
                break;
              case 0:
                _.length <= 2 * this.Patch_Margin && h && s.length != d + 1
                  ? ((a.diffs[h++] = s[d]), (a.length1 += _.length), (a.length2 += _.length))
                  : _.length >= 2 * this.Patch_Margin &&
                    h &&
                    (this.patch_addContext_(a, g),
                    o.push(a),
                    (a = new e.patch_obj()),
                    (h = 0),
                    (g = c),
                    (l = u));
            }
            1 !== p && (l += _.length), p !== n && (u += _.length);
          }
          return h && (this.patch_addContext_(a, g), o.push(a)), o;
        }),
        (e.prototype.patch_deepCopy = function (t) {
          for (var n = [], r = 0; r < t.length; r++) {
            var i = t[r],
              f = new e.patch_obj();
            f.diffs = [];
            for (var s = 0; s < i.diffs.length; s++)
              f.diffs[s] = new e.Diff(i.diffs[s][0], i.diffs[s][1]);
            (f.start1 = i.start1),
              (f.start2 = i.start2),
              (f.length1 = i.length1),
              (f.length2 = i.length2),
              (n[r] = f);
          }
          return n;
        }),
        (e.prototype.patch_apply = function (t, e) {
          if (0 == t.length) return [e, []];
          t = this.patch_deepCopy(t);
          var r = this.patch_addPadding(t);
          (e = r + e + r), this.patch_splitMax(t);
          for (var i = 0, f = [], s = 0; s < t.length; s++) {
            var o,
              a,
              h = t[s].start2 + i,
              l = this.diff_text1(t[s].diffs),
              u = -1;
            if (
              (l.length > this.Match_MaxBits
                ? -1 != (o = this.match_main(e, l.substring(0, this.Match_MaxBits), h)) &&
                  (-1 ==
                    (u = this.match_main(
                      e,
                      l.substring(l.length - this.Match_MaxBits),
                      h + l.length - this.Match_MaxBits
                    )) ||
                    o >= u) &&
                  (o = -1)
                : (o = this.match_main(e, l, h)),
              -1 == o)
            )
              (f[s] = !1), (i -= t[s].length2 - t[s].length1);
            else if (
              ((f[s] = !0),
              (i = o - h),
              l ==
                (a =
                  -1 == u ? e.substring(o, o + l.length) : e.substring(o, u + this.Match_MaxBits)))
            )
              e = e.substring(0, o) + this.diff_text2(t[s].diffs) + e.substring(o + l.length);
            else {
              var g = this.diff_main(l, a, !1);
              if (
                l.length > this.Match_MaxBits &&
                this.diff_levenshtein(g) / l.length > this.Patch_DeleteThreshold
              )
                f[s] = !1;
              else {
                this.diff_cleanupSemanticLossless(g);
                for (var c, d = 0, p = 0; p < t[s].diffs.length; p++) {
                  var _ = t[s].diffs[p];
                  0 !== _[0] && (c = this.diff_xIndex(g, d)),
                    1 === _[0]
                      ? (e = e.substring(0, o + c) + _[1] + e.substring(o + c))
                      : _[0] === n &&
                        (e =
                          e.substring(0, o + c) +
                          e.substring(o + this.diff_xIndex(g, d + _[1].length))),
                    _[0] !== n && (d += _[1].length);
                }
              }
            }
          }
          return [(e = e.substring(r.length, e.length - r.length)), f];
        }),
        (e.prototype.patch_addPadding = function (t) {
          for (var n = this.Patch_Margin, r = '', i = 1; i <= n; i++) r += String.fromCharCode(i);
          for (i = 0; i < t.length; i++) (t[i].start1 += n), (t[i].start2 += n);
          var f = t[0],
            s = f.diffs;
          if (0 == s.length || 0 != s[0][0])
            s.unshift(new e.Diff(0, r)),
              (f.start1 -= n),
              (f.start2 -= n),
              (f.length1 += n),
              (f.length2 += n);
          else if (n > s[0][1].length) {
            var o = n - s[0][1].length;
            (s[0][1] = r.substring(s[0][1].length) + s[0][1]),
              (f.start1 -= o),
              (f.start2 -= o),
              (f.length1 += o),
              (f.length2 += o);
          }
          return (
            0 == (s = (f = t[t.length - 1]).diffs).length || 0 != s[s.length - 1][0]
              ? (s.push(new e.Diff(0, r)), (f.length1 += n), (f.length2 += n))
              : n > s[s.length - 1][1].length &&
                ((o = n - s[s.length - 1][1].length),
                (s[s.length - 1][1] += r.substring(0, o)),
                (f.length1 += o),
                (f.length2 += o)),
            r
          );
        }),
        (e.prototype.patch_splitMax = function (t) {
          for (var r = this.Match_MaxBits, i = 0; i < t.length; i++)
            if (!(t[i].length1 <= r)) {
              var f = t[i];
              t.splice(i--, 1);
              for (var s = f.start1, o = f.start2, a = ''; 0 !== f.diffs.length; ) {
                var h = new e.patch_obj(),
                  l = !0;
                for (
                  h.start1 = s - a.length,
                    h.start2 = o - a.length,
                    '' !== a &&
                      ((h.length1 = h.length2 = a.length), h.diffs.push(new e.Diff(0, a)));
                  0 !== f.diffs.length && h.length1 < r - this.Patch_Margin;

                ) {
                  var u = f.diffs[0][0],
                    g = f.diffs[0][1];
                  1 === u
                    ? ((h.length2 += g.length),
                      (o += g.length),
                      h.diffs.push(f.diffs.shift()),
                      (l = !1))
                    : u === n && 1 == h.diffs.length && 0 == h.diffs[0][0] && g.length > 2 * r
                    ? ((h.length1 += g.length),
                      (s += g.length),
                      (l = !1),
                      h.diffs.push(new e.Diff(u, g)),
                      f.diffs.shift())
                    : ((g = g.substring(0, r - h.length1 - this.Patch_Margin)),
                      (h.length1 += g.length),
                      (s += g.length),
                      0 === u ? ((h.length2 += g.length), (o += g.length)) : (l = !1),
                      h.diffs.push(new e.Diff(u, g)),
                      g == f.diffs[0][1]
                        ? f.diffs.shift()
                        : (f.diffs[0][1] = f.diffs[0][1].substring(g.length)));
                }
                a = (a = this.diff_text2(h.diffs)).substring(a.length - this.Patch_Margin);
                var c = this.diff_text1(f.diffs).substring(0, this.Patch_Margin);
                '' !== c &&
                  ((h.length1 += c.length),
                  (h.length2 += c.length),
                  0 !== h.diffs.length && 0 === h.diffs[h.diffs.length - 1][0]
                    ? (h.diffs[h.diffs.length - 1][1] += c)
                    : h.diffs.push(new e.Diff(0, c))),
                  l || t.splice(++i, 0, h);
              }
            }
        }),
        (e.prototype.patch_toText = function (t) {
          for (var e = [], n = 0; n < t.length; n++) e[n] = t[n];
          return e.join('');
        }),
        (e.prototype.patch_fromText = function (t) {
          var r = [];
          if (!t) return r;
          for (
            var i = t.split('\n'), f = 0, s = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
            f < i.length;

          ) {
            var o = i[f].match(s);
            if (!o) throw new Error('Invalid patch string: ' + i[f]);
            var a = new e.patch_obj();
            for (
              r.push(a),
                a.start1 = parseInt(o[1], 10),
                '' === o[2]
                  ? (a.start1--, (a.length1 = 1))
                  : '0' == o[2]
                  ? (a.length1 = 0)
                  : (a.start1--, (a.length1 = parseInt(o[2], 10))),
                a.start2 = parseInt(o[3], 10),
                '' === o[4]
                  ? (a.start2--, (a.length2 = 1))
                  : '0' == o[4]
                  ? (a.length2 = 0)
                  : (a.start2--, (a.length2 = parseInt(o[4], 10))),
                f++;
              f < i.length;

            ) {
              var h = i[f].charAt(0);
              try {
                var l = decodeURI(i[f].substring(1));
              } catch (t) {
                throw new Error('Illegal escape in patch_fromText: ' + l);
              }
              if ('-' == h) a.diffs.push(new e.Diff(n, l));
              else if ('+' == h) a.diffs.push(new e.Diff(1, l));
              else if (' ' == h) a.diffs.push(new e.Diff(0, l));
              else {
                if ('@' == h) break;
                if ('' !== h) throw new Error('Invalid patch mode "' + h + '" in: ' + l);
              }
              f++;
            }
          }
          return r;
        }),
        ((e.patch_obj = function () {
          (this.diffs = []),
            (this.start1 = null),
            (this.start2 = null),
            (this.length1 = 0),
            (this.length2 = 0);
        }).prototype.toString = function () {
          for (
            var t,
              e = [
                '@@ -' +
                  (0 === this.length1
                    ? this.start1 + ',0'
                    : 1 == this.length1
                    ? this.start1 + 1
                    : this.start1 + 1 + ',' + this.length1) +
                  ' +' +
                  (0 === this.length2
                    ? this.start2 + ',0'
                    : 1 == this.length2
                    ? this.start2 + 1
                    : this.start2 + 1 + ',' + this.length2) +
                  ' @@\n',
              ],
              r = 0;
            r < this.diffs.length;
            r++
          ) {
            switch (this.diffs[r][0]) {
              case 1:
                t = '+';
                break;
              case n:
                t = '-';
                break;
              case 0:
                t = ' ';
            }
            e[r + 1] = t + encodeURI(this.diffs[r][1]) + '\n';
          }
          return e.join('').replace(/%20/g, ' ');
        }),
        (t.exports = e),
        (t.exports.diff_match_patch = e),
        (t.exports.DIFF_DELETE = n),
        (t.exports.DIFF_INSERT = 1),
        (t.exports.DIFF_EQUAL = 0);
    },
    301: (t, e, n) => {
      t.exports = n(9);
    },
    9: (t, e, n) => {
      (e.fromRange = function (t, e) {
        if (void 0 === t) throw new Error('missing required parameter "root"');
        if (void 0 === e) throw new Error('missing required parameter "range"');
        return (function (t, e) {
          if (void 0 === t) throw new Error('missing required parameter "root"');
          if (void 0 === e) throw new Error('missing required parameter "selector"');
          var n = e.start;
          if (void 0 === n) throw new Error('selector missing required property "start"');
          if (n < 0) throw new Error('property "start" must be a non-negative integer');
          var r = e.end;
          if (void 0 === r) throw new Error('selector missing required property "end"');
          if (r < 0) throw new Error('property "end" must be a non-negative integer');
          var i = t.textContent.substr(n, r - n),
            f = Math.max(0, n - 32),
            s = t.textContent.substr(f, n - f),
            o = Math.min(t.textContent.length, r + 32);
          return { exact: i, prefix: s, suffix: t.textContent.substr(r, o - r) };
        })(t, f.fromRange(t, e));
      }),
        (e.toRange = function (t, e) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            r = o(t, e, n);
          return null === r ? null : f.toRange(t, r);
        });
      var r,
        i = (r = n(658)) && r.__esModule ? r : { default: r },
        f = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(995)),
        s = new RegExp('(.|[\r\n]){1,' + String(32) + '}', 'g');
      function o(t, e) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        if (void 0 === t) throw new Error('missing required parameter "root"');
        if (void 0 === e) throw new Error('missing required parameter "selector"');
        var r = e.exact;
        if (void 0 === r) throw new Error('selector missing required property "exact"');
        var f = e.prefix,
          o = e.suffix,
          a = n.hint,
          h = new i.default();
        h.Match_Distance = 2 * t.textContent.length;
        var l = r.match(s),
          u = void 0 === a ? (t.textContent.length / 2) | 0 : a,
          g = Number.POSITIVE_INFINITY,
          c = Number.NEGATIVE_INFINITY,
          d = -1,
          p = void 0 !== f,
          _ = void 0 !== o,
          v = !1;
        p && (d = h.match_main(t.textContent, f, u)) > -1 && ((u = d + f.length), (v = !0)),
          _ && !v && (d = h.match_main(t.textContent, o, u + r.length)) > -1 && (u = d - r.length);
        var m = l.shift();
        if (!((d = h.match_main(t.textContent, m, u)) > -1)) return null;
        u = c = (g = d) + m.length;
        var b = function (e, n) {
          if (!e) return null;
          var r = h.match_main(t.textContent, n, e.loc);
          return -1 === r
            ? null
            : ((e.loc = r + n.length),
              (e.start = Math.min(e.start, r)),
              (e.end = Math.max(e.end, r + n.length)),
              e);
        };
        h.Match_Distance = 64;
        var w = l.reduce(b, { start: g, end: c, loc: u });
        return w ? { start: w.start, end: w.end } : null;
      }
    },
    995: (t, e, n) => {
      t.exports = n(918);
    },
    918: (t, e, n) => {
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.fromRange = function (t, e) {
          if (void 0 === t) throw new Error('missing required parameter "root"');
          if (void 0 === e) throw new Error('missing required parameter "range"');
          var n = t.ownerDocument.createRange(),
            r = e.startContainer,
            i = e.startOffset;
          n.setStart(t, 0), n.setEnd(r, i);
          var s = (0, f.default)(n).length;
          return { start: s, end: s + (0, f.default)(e).length };
        }),
        (e.toRange = function (t) {
          var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1];
          if (void 0 === t) throw new Error('missing required parameter "root"');
          var n = t.ownerDocument,
            f = n.createRange(),
            s = (0, r.default)(t, 4),
            o = e.start || 0,
            a = e.end || o,
            h = (0, i.default)(s, o),
            l = o - h;
          s.pointerBeforeReferenceNode
            ? f.setStart(s.referenceNode, l)
            : (f.setStart(s.nextNode(), l), s.previousNode());
          var u = a - o + l;
          return (
            (l = u - (h = (0, i.default)(s, u))),
            s.pointerBeforeReferenceNode ? f.setEnd(s.referenceNode, l) : f.setEnd(s.nextNode(), l),
            f
          );
        });
      var r = s(n(737)),
        i = s(n(503)),
        f = s(n(622));
      function s(t) {
        return t && t.__esModule ? t : { default: t };
      }
    },
    622: (t, e) => {
      function n(t, e) {
        if (!e && t.firstChild) return t.firstChild;
        do {
          if (t.nextSibling) return t.nextSibling;
          t = t.parentNode;
        } while (t);
        return t;
      }
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.default = function (t) {
          var e = '';
          return (
            (function (t, e) {
              for (
                var r = (function (t) {
                    return t.startContainer.nodeType === Node.ELEMENT_NODE
                      ? t.startContainer.childNodes[t.startOffset] || n(t.startContainer, !0)
                      : t.startContainer;
                  })(t),
                  i = (function (t) {
                    return t.endContainer.nodeType === Node.ELEMENT_NODE
                      ? t.endContainer.childNodes[t.endOffset] || n(t.endContainer, !0)
                      : n(t.endContainer);
                  })(t);
                r !== i;

              )
                e(r), (r = n(r));
            })(t, function (n) {
              if (n.nodeType === Node.TEXT_NODE) {
                var r = n === t.startContainer ? t.startOffset : 0,
                  i = n === t.endContainer ? t.endOffset : n.textContent.length;
                e += n.textContent.slice(r, i);
              }
            }),
            e
          );
        });
    },
    503: (t, e, n) => {
      t.exports = n(595).default;
    },
    595: (t, e, n) => {
      e.default = function (t, e) {
        if (4 !== t.whatToShow)
          throw new Error('Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.');
        var n,
          f = 0,
          s = t.referenceNode,
          o = null;
        if (((n = e), !isNaN(parseInt(n)) && isFinite(n)))
          o = {
            forward: function () {
              return f < e;
            },
            backward: function () {
              return f > e;
            },
          };
        else {
          if (
            !(function (t) {
              return 3 === t.nodeType;
            })(e)
          )
            throw new Error('Argument 2 of seek must be a number or a Text Node.');
          var a = (function (t, e) {
            if (t === e) return !1;
            for (
              var n = null,
                f = [t].concat((0, r.default)(t)).reverse(),
                s = [e].concat((0, r.default)(e)).reverse();
              f[0] === s[0];

            )
              (n = f.shift()), s.shift();
            return (
              (f = f[0]),
              (s = s[0]),
              (0, i.default)(n.childNodes, f) > (0, i.default)(n.childNodes, s)
            );
          })(s, e)
            ? function () {
                return !1;
              }
            : function () {
                return s !== e;
              };
          o = {
            forward: a,
            backward: function () {
              return s != e || !t.pointerBeforeReferenceNode;
            },
          };
        }
        for (; o.forward() && null !== (s = t.nextNode()); ) f += s.nodeValue.length;
        for (; o.backward() && null !== (s = t.previousNode()); ) f -= s.nodeValue.length;
        return f;
      };
      var r = f(n(629)),
        i = f(n(703));
      function f(t) {
        return t && t.__esModule ? t : { default: t };
      }
    },
    285: (t, e, n) => {
      t.exports = n(408).default;
    },
    737: (t, e, n) => {
      (t.exports = n(332).default),
        (t.exports.getPolyfill = n(742)),
        (t.exports.implementation = n(285)),
        (t.exports.shim = n(846));
    },
    460: (t, e) => {
      (e.__esModule = !0),
        (e.default = function (t) {
          var e = arguments.length <= 1 || void 0 === arguments[1] ? 4294967295 : arguments[1],
            r = arguments.length <= 2 || void 0 === arguments[2] ? null : arguments[2],
            i = 9 == t.nodeType || t.ownerDocument,
            f = i.createNodeIterator(t, e, r, !1);
          return new n(f, t, e, r);
        });
      var n = (function () {
        function t(e, n, r, i) {
          !(function (t, e) {
            if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
          })(this, t),
            (this.root = n),
            (this.whatToShow = r),
            (this.filter = i),
            (this.referenceNode = n),
            (this.pointerBeforeReferenceNode = !0),
            (this._iter = e);
        }
        return (
          (t.prototype.nextNode = function () {
            var t = this._iter.nextNode();
            return (
              (this.pointerBeforeReferenceNode = !1),
              null === t ? null : ((this.referenceNode = t), this.referenceNode)
            );
          }),
          (t.prototype.previousNode = function () {
            var t = this._iter.previousNode();
            return (
              (this.pointerBeforeReferenceNode = !0),
              null === t ? null : ((this.referenceNode = t), this.referenceNode)
            );
          }),
          (t.prototype.toString = function () {
            return '[object NodeIterator]';
          }),
          t
        );
      })();
    },
    792: (t, e) => {
      (e.__esModule = !0),
        (e.default = function (t) {
          var e = arguments.length <= 1 || void 0 === arguments[1] ? 4294967295 : arguments[1],
            n = arguments.length <= 2 || void 0 === arguments[2] ? null : arguments[2],
            r = t.ownerDocument;
          return r.createNodeIterator.call(r, t, e, n);
        });
    },
    408: (t, e) => {
      (e.__esModule = !0),
        (e.default = function (t) {
          var e = arguments.length <= 1 || void 0 === arguments[1] ? 4294967295 : arguments[1],
            r = arguments.length <= 2 || void 0 === arguments[2] ? null : arguments[2];
          return new n(t, e, r);
        });
      var n = (function () {
        function t(e, n, r) {
          !(function (t, e) {
            if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
          })(this, t),
            (this.root = e),
            (this.whatToShow = n),
            (this.filter = r),
            (this.referenceNode = e),
            (this.pointerBeforeReferenceNode = !0),
            (this._filter = function (t) {
              return !r || 1 === r(t);
            }),
            (this._show = function (t) {
              return (n >> (t.nodeType - 1)) & !0;
            });
        }
        return (
          (t.prototype.nextNode = function () {
            var t = this.pointerBeforeReferenceNode;
            this.pointerBeforeReferenceNode = !1;
            var e = this.referenceNode;
            if (t && this._show(e) && this._filter(e)) return e;
            do {
              if (e.firstChild) e = e.firstChild;
              else {
                do {
                  if (e === this.root) return null;
                  if (e.nextSibling) break;
                  e = e.parentNode;
                } while (e);
                e = e.nextSibling;
              }
            } while (!this._show(e) || !this._filter(e));
            return (this.referenceNode = e), (this.pointerBeforeReferenceNode = !1), e;
          }),
          (t.prototype.previousNode = function () {
            var t = this.pointerBeforeReferenceNode;
            this.pointerBeforeReferenceNode = !0;
            var e = this.referenceNode;
            if (!t && this._show(e) && this._filter(e)) return e;
            do {
              if (e === this.root) return null;
              if (e.previousSibling) for (e = e.previousSibling; e.lastChild; ) e = e.lastChild;
              else e = e.parentNode;
            } while (!this._show(e) || !this._filter(e));
            return (this.referenceNode = e), (this.pointerBeforeReferenceNode = !0), e;
          }),
          (t.prototype.toString = function () {
            return '[object NodeIterator]';
          }),
          t
        );
      })();
    },
    332: (t, e, n) => {
      var r = s(n(778)),
        i = s(n(408)),
        f = s(n(590));
      function s(t) {
        return t && t.__esModule ? t : { default: t };
      }
      var o = (0, r.default)();
      (o.implementation = i.default), (o.shim = f.default), (e.default = o);
    },
    778: (t, e, n) => {
      (e.__esModule = !0),
        (e.default = function () {
          try {
            var t = 'undefined' == typeof document ? {} : document;
            return (0, i.default)(t, 4294967295, null, !1).referenceNode === t
              ? i.default
              : r.default;
          } catch (t) {
            return f.default;
          }
        });
      var r = s(n(460)),
        i = s(n(792)),
        f = s(n(408));
      function s(t) {
        return t && t.__esModule ? t : { default: t };
      }
    },
    590: (t, e, n) => {
      (e.__esModule = !0),
        (e.default = function () {
          var t = 'undefined' == typeof document ? {} : document,
            e = (0, i.default)();
          return e !== r.default && (t.createNodeIterator = e), e;
        });
      var r = f(n(792)),
        i = f(n(778));
      function f(t) {
        return t && t.__esModule ? t : { default: t };
      }
    },
    742: (t, e, n) => {
      t.exports = n(778).default;
    },
    846: (t, e, n) => {
      t.exports = n(590).default;
    },
    703: (t) => {
      t.exports = function (t, e, n) {
        if (((n = n || 0), null == t)) return -1;
        var r = t.length,
          i = n < 0 ? r + n : n;
        if (i >= t.length) return -1;
        for (; i < r; ) {
          if (t[i] === e) return i;
          i++;
        }
        return -1;
      };
    },
  },
  e = {};
function n(r) {
  var i = e[r];
  if (void 0 !== i) return i.exports;
  var f = (e[r] = { exports: {} });
  return t[r](f, f.exports, n), f.exports;
}
(n.d = (t, e) => {
  for (var r in e)
    n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
}),
  (n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e));
var r = {};
(() => {
  n.d(r, { I: () => e });
  var t = n(301);
  const e = (e) => {
    let n = [];
    const r = () => {
      n.forEach((t) => t[0](t[1])),
        (n = e.flatMap((e) => {
          const n = t.toRange(document.body, e.textQuoteSelector);
          return n ? [[e.cleanUp, e.inject(n)]] : [];
        }));
    };
    r();
    const i = new MutationObserver(() => {
        i.disconnect(), r(), f();
      }),
      f = () => i.observe(document.body, { subtree: !0, childList: !0, characterData: !0 });
    f();
  };
  globalThis.getTextQuoteSelectorfromSelection = () => {
    const e = getSelection();
    if (e && !(e.rangeCount < 1)) return t.fromRange(document.body, e.getRangeAt(0));
  };
})();
var i = r.I;
export { i as injectByTextQuote };
