import React, { useEffect, useState, Suspense } from 'react'
import { useLocation } from 'react-router-dom'

interface MicroFrontendPageProps {
  remoteName: string
  moduleName: string
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">Carregando módulo...</p>
      </div>
    </div>
  )
}

export function MicroFrontendPage({ remoteName, moduleName }: MicroFrontendPageProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    const loadMicroFrontend = async () => {
      try {
        setError(null)
        setComponent(null)

        // Dynamically import the remote module using Module Federation
        // Format: remoteName/./moduleName (exposes use './App' format)
        const importPath = `${remoteName}/./${moduleName}`

        const logContext = {
          remoteName,
          moduleName,
          importPath,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          location: window.location.href
        }

        console.log(`[Module Federation] Attempting to load: ${importPath}`, logContext)

        // Check if window.__FEDERATION__ exists (Module Federation runtime)
        if (typeof window !== 'undefined' && (window as any).__FEDERATION__) {
          const federation = (window as any).__FEDERATION__
          const remoteDetails = federation?.[remoteName]
            ? {
              exists: true,
              name: federation[remoteName]?.name,
              entry: federation[remoteName]?.entry,
              exposes: federation[remoteName]?.exposes || 'not available'
            }
            : 'not found'

          const allRemotesInfo = federation ? Object.keys(federation).reduce((acc, key) => {
            acc[key] = {
              name: federation[key]?.name,
              entry: federation[key]?.entry,
              type: typeof federation[key],
              keys: Object.keys(federation[key] || {}),
              fullObject: federation[key]
            }
            return acc
          }, {} as Record<string, any>) : {}

          const instance = (federation as any)?.__INSTANCES__?.[0]
          const instanceRemotes = instance?.options?.remotes || []

          console.log(`[Module Federation] Runtime detected:`, {
            federationExists: !!federation,
            remotes: federation ? Object.keys(federation) : [],
            remoteInfo: remoteDetails,
            allRemotes: allRemotesInfo,
            instanceRemotes: instanceRemotes,
            instanceRemotesLength: instanceRemotes.length,
            instanceRemotesDetails: instanceRemotes.map((r: any) => ({
              name: r?.name,
              entry: r?.entry,
              type: r?.type,
              alias: r?.alias,
              keys: r ? Object.keys(r) : []
            })),
            federationStructure: {
              keys: federation ? Object.keys(federation) : [],
              hasInstances: !!(federation as any)?.__INSTANCES__,
              instancesCount: (federation as any)?.__INSTANCES__?.length || 0,
              moduleInfo: (federation as any)?.moduleInfo || 'not available',
              instanceOptions: instance?.options ? {
                name: instance.options.name,
                remotes: instance.options.remotes,
                remotesLength: instance.options.remotes?.length || 0
              } : 'no instance'
            }
          })

          // Try to access loadRemote API if available
          if (federation && typeof (federation as any).loadRemote === 'function') {
            console.log(`[Module Federation] loadRemote API available`)
          } else {
            console.warn(`[Module Federation] loadRemote API not found. Available methods:`,
              federation ? Object.keys(federation).filter(k => typeof (federation as any)[k] === 'function') : []
            )
          }

          // Log detailed instance information
          if (instance) {
            const fullOptionsStr = JSON.stringify(instance.options, null, 2)
            console.log(`[Module Federation] Instance details:`, {
              name: instance.name,
              optionsKeys: Object.keys(instance.options || {}),
              remotesConfig: instance.options?.remotes,
              remotesType: typeof instance.options?.remotes,
              remotesIsArray: Array.isArray(instance.options?.remotes),
              remotesLength: instance.options?.remotes?.length || 0,
              fullOptions: instance.options,
              fullOptionsString: fullOptionsStr.substring(0, 2000),
              hasRemoteHandler: !!instance.remoteHandler,
              remoteHandlerMethods: instance.remoteHandler ? Object.keys(instance.remoteHandler).filter(k => typeof instance.remoteHandler[k] === 'function') : [],
              remoteHandlerKeys: instance.remoteHandler ? Object.keys(instance.remoteHandler) : [],
              moduleInfo: (federation as any)?.moduleInfo,
              allFederationKeys: federation ? Object.keys(federation) : [],
              snapshotHandler: instance.snapshotHandler ? {
                exists: true,
                keys: Object.keys(instance.snapshotHandler)
              } : null
            })
            console.log(`[Module Federation] Full options (complete):`, instance.options)
          } else {
            console.warn(`[Module Federation] No instance found in __INSTANCES__`)
          }
        } else {
          console.warn(`[Module Federation] Runtime not detected - Module Federation may not be initialized`)
        }

        // Try to check remoteEntry accessibility (for debugging)
        const remotePorts: Record<string, number> = {
          ai: 3002,
          crm: 3003,
          erp: 3004,
          finance: 3005,
          pdv: 3006,
          rpg: 3007,
          sso: 3001
        }
        const defaultPort = remotePorts[remoteName]
        const remoteEntryUrl = defaultPort
          ? `http://localhost:${defaultPort}/assets/remoteEntry.js`
          : `unknown`

        console.log(`[Module Federation] Remote entry URL: ${remoteEntryUrl}`)

        // Try to fetch remoteEntry to verify accessibility and content
        try {
          const response = await fetch(remoteEntryUrl, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache'
            }
          })
          const contentLength = response.headers.get('content-length')
          const contentType = response.headers.get('content-type')

          let contentPreview = ''
          if (response.ok) {
            const text = await response.text()
            contentPreview = text.substring(0, 200)
            const isEmpty = text.trim().length === 0

            console.log(`[Module Federation] Remote entry accessibility check:`, {
              url: remoteEntryUrl,
              status: response.status,
              statusText: response.statusText,
              accessible: response.ok,
              contentLength: contentLength || text.length,
              contentType,
              isEmpty,
              preview: contentPreview,
              fullLength: text.length
            })

            if (isEmpty) {
              console.error(`[Module Federation] WARNING: remoteEntry.js is EMPTY! This will cause module resolution to fail.`)
            }
          } else {
            console.error(`[Module Federation] Remote entry not accessible:`, {
              url: remoteEntryUrl,
              status: response.status,
              statusText: response.statusText
            })
          }
        } catch (fetchErr) {
          console.error(`[Module Federation] Error fetching remote entry:`, {
            url: remoteEntryUrl,
            error: fetchErr instanceof Error ? {
              name: fetchErr.name,
              message: fetchErr.message,
              stack: fetchErr.stack
            } : fetchErr
          })
        }

        // Try to use Module Federation loadRemote API if available
        let container: any = null
        let importError: Error | null = null

        // Check if we can use loadRemote from the runtime
        const federation = typeof window !== 'undefined' ? (window as any).__FEDERATION__ : null
        const hostInstance = federation?.__INSTANCES__?.[0]

        if (hostInstance && typeof hostInstance.loadRemote === 'function') {
          try {
            console.log(`[Module Federation] Using loadRemote API with path: ${importPath}`)
            const moduleOrFactory = await hostInstance.loadRemote(`${remoteName}/./${moduleName}`)
            container = typeof moduleOrFactory === 'function' ? await moduleOrFactory() : moduleOrFactory
            console.log(`[Module Federation] loadRemote successful:`, {
              moduleType: typeof moduleOrFactory,
              isFunction: typeof moduleOrFactory === 'function',
              containerKeys: container ? Object.keys(container) : []
            })
          } catch (loadRemoteErr) {
            console.warn(`[Module Federation] loadRemote failed, trying direct import:`, {
              error: loadRemoteErr instanceof Error ? loadRemoteErr.message : loadRemoteErr
            })
            importError = loadRemoteErr instanceof Error ? loadRemoteErr : new Error(String(loadRemoteErr))
          }
        }

        // Fallback to direct import if loadRemote is not available or failed
        if (!container) {
          // Try: remoteName/./App (with ./ - correct format for exposes: { './App': ... })
          try {
            console.log(`[Module Federation] Trying import format: ${importPath}`)
            container = await import(/* @vite-ignore */ importPath)
            console.log(`[Module Federation] Import successful with format: ${importPath}`)
          } catch (err) {
            importError = err instanceof Error ? err : new Error(String(err))
            console.warn(`[Module Federation] Import failed with format ${importPath}:`, {
              error: importError.message,
              name: importError.name
            })

            // Fallback try: remoteName/App (without ./)
            const altImportPath = `${remoteName}/${moduleName}`
            try {
              console.log(`[Module Federation] Trying alternative import format: ${altImportPath}`)
              container = await import(/* @vite-ignore */ altImportPath)
              console.log(`[Module Federation] Import successful with alternative format: ${altImportPath}`)
              logContext.importPath = altImportPath
            } catch (altErr) {
              const altError = altErr instanceof Error ? altErr : new Error(String(altErr))
              console.error(`[Module Federation] All import methods failed:`, {
                loadRemote: importError?.message,
                format1: { path: importPath, error: importError.message },
                format2: { path: altImportPath, error: altError.message }
              })
              throw importError || altError
            }
          }
        }

        console.log(`[Module Federation] Import successful, container received:`, {
          importPath: logContext.importPath,
          containerKeys: Object.keys(container || {}),
          hasDefault: 'default' in container,
          containerType: typeof container,
          containerValue: container
        })

        const RemoteComponent = container.default || container

        if (isMounted && RemoteComponent) {
          console.log(`[Module Federation] Successfully loaded: ${importPath}`, {
            hasDefault: !!container.default,
            hasContainer: !!container,
            componentType: typeof RemoteComponent,
            isFunction: typeof RemoteComponent === 'function',
            isComponent: typeof RemoteComponent === 'function' && RemoteComponent.prototype
          })
          setComponent(() => RemoteComponent)
        } else if (isMounted) {
          const errorMsg = `Component not found in container for ${importPath}`
          console.error(`[Module Federation] ${errorMsg}`, {
            container,
            hasDefault: !!container.default,
            hasContainer: !!container,
            containerKeys: Object.keys(container || {}),
            RemoteComponent
          })
          setError(errorMsg)
        }
      } catch (err) {
        const errorDetails = {
          remoteName,
          moduleName,
          importPath: `${remoteName}/${moduleName}`,
          error: err instanceof Error ? {
            name: err.name,
            message: err.message,
            stack: err.stack,
            cause: (err as any).cause,
            code: (err as any).code
          } : {
            type: typeof err,
            value: err
          },
          timestamp: new Date().toISOString(),
          federationRuntime: typeof window !== 'undefined' ? {
            exists: !!(window as any).__FEDERATION__,
            remotes: typeof window !== 'undefined' && (window as any).__FEDERATION__
              ? Object.keys((window as any).__FEDERATION__)
              : []
          } : null
        }

        console.error(`[Module Federation] Error loading micro-frontend ${remoteName}:`, errorDetails)
        console.error(`[Module Federation] Full error object:`, err)

        if (isMounted) {
          const errorMessage = err instanceof Error
            ? `Failed to load ${remoteName}: ${err.message}`
            : `Failed to load ${remoteName}. Please ensure the micro-frontend is running.`
          setError(errorMessage)
        }
      }
    }

    loadMicroFrontend()

    return () => {
      isMounted = false
    }
  }, [remoteName, moduleName, location.pathname])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Error Loading Module</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!Component) {
    return <LoadingFallback />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  )
}

