// Copyright (c) 2023-2024 Continue Dev, Inc.
// Copyright (c) 2025 Bytedance Ltd.
// SPDX-License-Identifier: Apache-2.0
//
// This file has been modified by Bytedance Ltd on fetchwithRequestOptions
//
// Original file was released under Apache-2.0, with the full license text
// available at https://github.com/continuedev/continue?tab=Apache-2.0-1-ov-file.
//
// This modified file is released under the same license.

import * as followRedirects from 'follow-redirects'
import { HttpProxyAgent } from 'http-proxy-agent'
import { globalAgent } from 'https'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch, { RequestInit, Response } from 'node-fetch'
import * as fs from 'node:fs'
import tls from 'node:tls'
const { http, https } = (followRedirects as any).default

export interface ClientCertificateOptions {
  cert: string
  key: string
  passphrase?: string
}

export interface RequestOptions {
  timeout?: number
  verifySsl?: boolean
  caBundlePath?: string | string[]
  proxy?: string
  secureProtocol?: string
  headers?: { [key: string]: string }
  extraBodyProperties?: { [key: string]: any }
  noProxy?: string[]
  clientCertificate?: ClientCertificateOptions
}

export namespace FetchUtils {
  export function fetchwithRequestOptions(
    url_: URL | string,
    init?: RequestInit,
    requestOptions?: RequestOptions
  ): Promise<Response> {
    let url = url_
    if (typeof url === 'string') {
      url = new URL(url)
    }

    const TIMEOUT = 7200 // 7200 seconds = 2 hours

    let globalCerts: string[] = []
    if (process.env.IS_BINARY) {
      if (Array.isArray(globalAgent.options.ca)) {
        globalCerts = [...globalAgent.options.ca.map((cert) => cert.toString())]
      } else if (typeof globalAgent.options.ca !== 'undefined') {
        globalCerts.push(globalAgent.options.ca.toString())
      }
    }
    const ca = Array.from(new Set([...tls.rootCertificates, ...globalCerts]))
    const customCerts =
      typeof requestOptions?.caBundlePath === 'string'
        ? [requestOptions?.caBundlePath]
        : requestOptions?.caBundlePath
    if (customCerts) {
      ca.push(...customCerts.map((customCert) => fs.readFileSync(customCert, 'utf8')))
    }

    const timeout = (requestOptions?.timeout ?? TIMEOUT) * 1000 // measured in ms

    const agentOptions: { [key: string]: any } = {
      ca,
      rejectUnauthorized: requestOptions?.verifySsl,
      timeout,
      sessionTimeout: timeout,
      keepAlive: true,
      secureProtocol: requestOptions?.secureProtocol,
      keepAliveMsecs: timeout,
    }

    // Handle ClientCertificateOptions
    if (requestOptions?.clientCertificate) {
      agentOptions.cert = fs.readFileSync(requestOptions.clientCertificate.cert, 'utf8')
      agentOptions.key = fs.readFileSync(requestOptions.clientCertificate.key, 'utf8')
      if (requestOptions.clientCertificate.passphrase) {
        agentOptions.passphrase = requestOptions.clientCertificate.passphrase
      }
    }

    const proxy = requestOptions?.proxy

    // Create agent
    const protocol = url.protocol === 'https:' ? https : http
    const agent =
      proxy && !requestOptions?.noProxy?.includes(url.hostname)
        ? protocol === https
          ? new HttpsProxyAgent(proxy, agentOptions)
          : new HttpProxyAgent(proxy, agentOptions)
        : new protocol.Agent(agentOptions)

    let headers: { [key: string]: string } = {}
    for (const [key, value] of Object.entries(init?.headers || {})) {
      headers[key] = value as string
    }
    headers = {
      ...headers,
      ...requestOptions?.headers,
    }

    // Replace localhost with 127.0.0.1
    if (url.hostname === 'localhost') {
      url.hostname = '127.0.0.1'
    }

    // add extra body properties if provided
    let updatedBody: string | undefined = undefined
    try {
      if (requestOptions?.extraBodyProperties && typeof init?.body === 'string') {
        const parsedBody = JSON.parse(init.body)
        updatedBody = JSON.stringify({
          ...parsedBody,
          ...requestOptions.extraBodyProperties,
        })
      }
    } catch (e) {
      console.log('Unable to parse HTTP request body: ', e)
    }

    // fetch the request with the provided options
    const resp = fetch(url, {
      ...init,
      body: updatedBody ?? init?.body,
      headers: headers,
      agent: agent,
    })

    return resp
  }
}
